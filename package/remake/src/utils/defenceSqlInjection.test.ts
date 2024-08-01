import {
  expect,
  it,
} from 'vitest';
import defenceSqlInjection from '@utils/defenceSqlInjection';

it('SQL inject 테스트', () => {
  expect(defenceSqlInjection('select * from test')).toBe('  from test');
  expect(defenceSqlInjection('SELECT UserId, Name, Password FROM Users WHERE UserId = 105 or 1=1;'))
    .toBe(' UserId, Name, Passwd FROM Users WHERE UserId  105  11;');
  expect(defenceSqlInjection('SELECT UserId, Name, Password FROM Users WHERE UserId = 105 or (1=1);', [
    'from',
    'where',
    /[()]/,
  ]))
    .toBe(' UserId, Name, Passwd  Users  UserId  105  11;');
});
