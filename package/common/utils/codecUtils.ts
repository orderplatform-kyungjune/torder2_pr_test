import { isLeft } from 'fp-ts/lib/Either';
import { AxiosResponse } from 'axios';
import { ExcessType } from '../codecs/excess';
import getTypeError from './reports';

export function runtimeTypeChecker<T>(codec: ExcessType<any>, res: AxiosResponse<T>): void {
  const {
    data,
    request,
  } = res;
  const validationData = codec.decode(data);
  const isException = isLeft(validationData);

  if (isException) {
    const runtimeErrorProperties = getTypeError(validationData);

    runtimeErrorProperties.forEach((err) => {
      const isString = typeof err === 'string';

      if (isString) {
        console.log('정의되지 않은 프로퍼티', err);
      } else {
        console.log('타입 에러', err);
      }
    });
  } else {
    const { responseURL } = request;
    console.log(`${responseURL} 에서 응답받은 데이터의 타입이 정상입니다.`);
  }
}

export default runtimeTypeChecker;
