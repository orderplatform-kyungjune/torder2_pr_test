import {
  expect,
  describe,
  it,
  vi,
  beforeEach,
} from 'vitest';
import {
  setActivePinia,
  createPinia,
} from 'pinia';
import axios from 'axios';
import { mount } from '@vue/test-utils';
import router from '@router';
import { createTestingPinia } from '@pinia/testing';
import StoreLogIn from './StoreLogIn.vue';

const MessageComponent = StoreLogIn;

describe('로그인 페이지 테스트 시작', () => {
  beforeEach(() => {
    // store를 이용하므로 스토어 주입
    setActivePinia(createPinia());
  });

  // 로그인 페이지를 mount 시켜 놓고 테스트 진행
  const wrapper = mount(MessageComponent, {
    global: {
      plugins: [
        router,
        createTestingPinia({ createSpy: vi.fn }),
      ],
    },
  });

  it('로그인 페이지가 정상적으로 렌더링 된다.', async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('로그인 페이지에 ID 인풋이 정상적으로 렌더링 된다.', async () => {
    expect(wrapper.find('.login-grid').exists()).toBe(true);
  });

  it('로그인 페이지에 테마 별 스타일링이 적용 된다.', () => {
    const themeType = wrapper?.vm.theme?.type as string;
    expect(wrapper.find('.container').classes()).toContain(themeType);
  });

  it('ID, PASSWORD를 입력한 값으로 로그인 요청을 시도한다', async () => {
    const inputId = 'testId';
    const inputPwd = 'testPassword';
    const spyPost = vi.spyOn(axios, 'post');

    await wrapper.find('.login-input-grid input[type="text"]').setValue(inputId);
    await wrapper.find('.login-input-grid input[type="password"]').setValue(inputPwd);
    await wrapper.find('.login-button button').trigger('click');

    expect(spyPost).toHaveBeenCalledTimes(1);

    const postFormData = spyPost.mock.calls[0][1] as FormData;

    expect(postFormData?.get('tablet_id')).toBe(inputId);
    expect(postFormData?.get('tablet_pwd')).toBe(inputPwd);
  });
});
