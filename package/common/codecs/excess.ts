/* eslint-disable @typescript-eslint/prefer-as-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
import * as t from 'io-ts';
import {
  either,
  Either,
  isRight,
  left,
  right,
  Right,
} from 'fp-ts/lib/Either';

const getIsCodec = <T extends t.Any>(tag: string) => (codec: t.Any): codec is T => (codec as any)._tag === tag;
const isInterfaceCodec = getIsCodec<t.InterfaceType<t.Props>>('InterfaceType');
const isPartialCodec = getIsCodec<t.PartialType<t.Props>>('PartialType');

const getProps = (codec: t.HasProps): t.Props => {
  switch (codec._tag) {
    case 'RefinementType':
    case 'ReadonlyType':
      return getProps(codec.type);
    // case 'InterfaceType':
    // case 'StrictType':
    // case 'PartialType':
    //   return codec.props;
    case 'IntersectionType':
      return codec.types.reduce<t.Props>((props, type) => Object.assign(props, getProps(type)), {});
    default:
      return codec.props;
  }
};

const getNameFromProps = (props: t.Props): string => Object.keys(props)
  .map((k) => `${k}: ${props[k].name}`)
  .join(', ');

const getPartialTypeName = (inner: string): string => `Partial<${inner}>`;

const getExcessTypeName = (codec: t.Any): string => {
  if (isInterfaceCodec(codec)) {
    return `{| ${getNameFromProps(codec.props)} |}`;
  }

  if (isPartialCodec(codec)) {
    return getPartialTypeName(`{| ${getNameFromProps(codec.props)} |}`);
  }

  return `Excess<${codec.name}>`;
};

const stripKeys = <T = any>(o: T, props: t.Props): Either<Array<string>, T> => {
  const keys = Object.getOwnPropertyNames(o);
  const propsKeys = Object.getOwnPropertyNames(props);

  propsKeys.forEach((pk) => {
    const index = keys.indexOf(pk);

    if (index !== -1) {
      keys.splice(index, 1);
    }
  });

  return keys.length
    ? left(keys)
    : right(o);
};

export class ExcessType<C extends t.Any, A = C['_A'], O = A, I = unknown> extends t.Type<A, O, I> {
  public readonly _tag: 'ExcessType' = 'ExcessType'

  public constructor(
    name: string,
    is: ExcessType<C, A, O, I>['is'],
    validate: ExcessType<C, A, O, I>['validate'],
    encode: ExcessType<C, A, O, I>['encode'],
    public readonly type: C,
  ) {
    super(name, is, validate, encode);
  }
}

export const excess = <C extends t.HasProps>(codec: C, name: string = getExcessTypeName(codec)): ExcessType<C> => {
  const props: t.Props = getProps(codec);

  return new ExcessType<C>(
    name,
    (u): u is C => isRight(stripKeys(u, props)) && codec.is(u),
    (u, c) => either.chain(
      t.UnknownRecord.validate(u, c),
      () => either.chain(
        codec.validate(u, c),
        (a) => either.mapLeft(
          stripKeys<C>(a, props),
          (keys) => keys.map((k) => ({
            value: a[k],
            context: c,
            message: `excess key "${k}" found`,
          })),
        ),
      ),
    ),
    (a) => codec.encode((stripKeys(a, props) as Right<any>).right),
    codec,
  );
};
