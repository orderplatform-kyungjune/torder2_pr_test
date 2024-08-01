import {
  colorType,
  typeType,
} from '@torder/common/interface/theme';

import {
  BLACK,
  HORIZONTAL,
  HYATT,
  RESTAURANT_HORIZONTAL,
  RESTAURANT_HORIZONTAL_CARD,
  RESTAURANT_VERTICAL,
  VERTICAL,
  WHITE,
} from '@torder/common/constant/string';

type defaultThemeStylesType = {
  [key in typeType]: {
    [key in colorType]?: {
      staffCallButton: {
        backgroundColor: string,
        fontColor: string,
      },
      button: {
        backgroundColor: string,
        fontColor: string,
      },
      font: {
        color: string,
        activeColor: string,
      },
      tableNum: {
        backgroundColor: string,
        fontColor: string,
      },
      category: {
        subCategory: {
          fontColor: string,
          activeFontColor: string,
        },
        mainCategory: {
          fontColor: string,
          activeFontColor: string,
        },
        backgroundImg: string,
        backgroundColor: string,
      },
      background: {
        backgroundColor: string,
      },
      bottomNavbar: {
        backgroundColor: string,
      },
    };
  }};

const defaultThemeStyles: defaultThemeStylesType = {
  [VERTICAL]: {
    [BLACK]: {
      staffCallButton: {
        backgroundColor: '#ff0000',
        fontColor: '#ffffff',
      },
      button: {
        backgroundColor: '#ff0000',
        fontColor: '#ffffff',
      },
      font: {
        color: '#000000',
        activeColor: '#ff0000',
      },
      tableNum: {
        backgroundColor: '#ff0000',
        fontColor: '#ffffff',
      },
      category: {
        subCategory: {
          fontColor: '#ffffff',
          activeFontColor: '#ffffff',
        },
        mainCategory: {
          fontColor: '#000000',
          activeFontColor: '#ffffff',
        },
        backgroundImg: '',
        backgroundColor: '#000000',
      },
      background: { backgroundColor: '#222222' },
      bottomNavbar: { backgroundColor: '#000000' },
    },
    [WHITE]: {
      staffCallButton: {
        backgroundColor: '#000000',
        fontColor: '#ffffff',
      },
      button: {
        backgroundColor: '#ff0000',
        fontColor: '#ffffff',
      },
      font: {
        color: '#000000',
        activeColor: '#ff0000',
      },
      tableNum: {
        backgroundColor: '#ff0000',
        fontColor: '#ffffff',
      },
      category: {
        subCategory: {
          fontColor: '#000000',
          activeFontColor: '#ffffff',
        },
        mainCategory: {
          fontColor: '#000000',
          activeFontColor: '#ffffff',
        },
        backgroundImg: '',
        backgroundColor: '#000000',
      },
      background: { backgroundColor: '#f3f3f3' },
      bottomNavbar: { backgroundColor: '#000000' },
    },
  },
  [HORIZONTAL]: {
    [BLACK]: {
      staffCallButton: {
        backgroundColor: '#ff0000',
        fontColor: '#ffffff',
      },
      button: {
        backgroundColor: '#ff0000',
        fontColor: '#ffffff',
      },
      font: {
        color: '#000000',
        activeColor: '#ff0000',
      },
      tableNum: {
        backgroundColor: '#ff0000',
        fontColor: '#ffffff',
      },
      category: {
        subCategory: {
          fontColor: '#ffffff',
          activeFontColor: '#ffffff',
        },
        mainCategory: {
          fontColor: '#ffffff',
          activeFontColor: '#ffffff',
        },
        backgroundImg: '',
        backgroundColor: '#000000',
      },
      background: { backgroundColor: '#222222' },
      bottomNavbar: { backgroundColor: '#000000' },
    },
    [WHITE]: {
      staffCallButton: {
        backgroundColor: '#ff0000',
        fontColor: '#ffffff',
      },
      button: {
        backgroundColor: '#ff0000',
        fontColor: '#ffffff',
      },
      font: {
        color: '#000000',
        activeColor: '#ff0000',
      },
      tableNum: {
        backgroundColor: '#ff0000',
        fontColor: '#ffffff',
      },
      category: {
        subCategory: {
          fontColor: '#000000',
          activeFontColor: '#ffffff',
        },
        mainCategory: {
          fontColor: '#000000',
          activeFontColor: '#ffffff',
        },
        backgroundImg: '',
        backgroundColor: '#000000',
      },
      background: { backgroundColor: '#f3f3f3' },
      bottomNavbar: { backgroundColor: '#000000' },
    },
  },
  [HYATT]: {
    [BLACK]: {
      staffCallButton: {
        backgroundColor: '#ffffff',
        fontColor: '#94ab41',
      },
      button: {
        backgroundColor: '#94ab41',
        fontColor: '#ffffff',
      },
      font: {
        color: '#000000',
        activeColor: '#94ab41',
      },
      tableNum: {
        backgroundColor: '#94ab41',
        fontColor: '#ffffff',
      },
      category: {
        subCategory: {
          fontColor: '#999999',
          activeFontColor: '#98aa51',
        },
        mainCategory: {
          fontColor: '#ffffff',
          activeFontColor: '#8eac26',
        },
        backgroundImg: 'https://d25d5hdteapulp.cloudfront.net/TEST_PRST100/goods/000948/1669093694item_700X700.png',
        backgroundColor: '#89a235',
      },
      background: { backgroundColor: '#ffffff' },
      bottomNavbar: { backgroundColor: '#ffffff' },
    },
    [WHITE]: {
      staffCallButton: {
        backgroundColor: '#ffffff',
        fontColor: '#94ab41',
      },
      button: {
        backgroundColor: '#94ab41',
        fontColor: '#ffffff',
      },
      font: {
        color: '#000000',
        activeColor: '#94ab41',
      },
      tableNum: {
        backgroundColor: '#94ab41',
        fontColor: '#ffffff',
      },
      category: {
        subCategory: {
          fontColor: '#999999',
          activeFontColor: '#98aa51',
        },
        mainCategory: {
          fontColor: '#ffffff',
          activeFontColor: '#8eac26',
        },
        backgroundImg: 'https://d25d5hdteapulp.cloudfront.net/TEST_PRST100/goods/000948/1669093694item_700X700.png',
        backgroundColor: '#89a235',
      },
      background: { backgroundColor: '#ffffff' },
      bottomNavbar: { backgroundColor: '#ffffff' },
    },
  },

  // 미사용 테마
  [RESTAURANT_HORIZONTAL]: {
    [BLACK]: {
      staffCallButton: {
        backgroundColor: '#ab240f',
        fontColor: '#ffffff',
      },
      button: {
        backgroundColor: '#ab240f',
        fontColor: '#ffffff',
      },
      font: {
        color: '#000000',
        activeColor: '#ab240f',
      },
      tableNum: {
        backgroundColor: '#2f2a26',
        fontColor: '#ffffff',
      },
      category: {
        subCategory: {
          fontColor: '#000000',
          activeFontColor: '#ab240f',
        },
        mainCategory: {
          fontColor: '#ffffff',
          activeFontColor: '#2f2a26',
        },
        backgroundImg: 'https://static.torder.co.kr/torder2/img_background_black_1280px.svg',
        backgroundColor: '#2f2a26',
      },
      background: { backgroundColor: '#ffffff' },
      bottomNavbar: { backgroundColor: '#ffffff' },
    },
    [WHITE]: {
      staffCallButton: {
        backgroundColor: '#ab240f',
        fontColor: '#ffffff',
      },
      button: {
        backgroundColor: '#ab240f',
        fontColor: '#ffffff',
      },
      font: {
        color: '#000000',
        activeColor: '#ab240f',
      },
      tableNum: {
        backgroundColor: '#2f2a26',
        fontColor: '#ffffff',
      },
      category: {
        subCategory: {
          fontColor: '#000000',
          activeFontColor: '#ab240f',
        },
        mainCategory: {
          fontColor: '#ffffff',
          activeFontColor: '#2f2a26',
        },
        backgroundImg: 'https://static.torder.co.kr/torder2/img_background_black_1280px.svg',
        backgroundColor: '#2f2a26',
      },
      background: { backgroundColor: '#ffffff' },
      bottomNavbar: { backgroundColor: '#ffffff' },
    },
  },
  [RESTAURANT_VERTICAL]: {
    [BLACK]: {
      staffCallButton: {
        backgroundColor: '#ab240f',
        fontColor: '#ffffff',
      },
      button: {
        backgroundColor: '#ab240f',
        fontColor: '#ffffff',
      },
      font: {
        color: '#000000',
        activeColor: '#ab240f',
      },
      tableNum: {
        backgroundColor: '#2f2a26',
        fontColor: '#ffffff',
      },
      category: {
        subCategory: {
          fontColor: '#000000',
          activeFontColor: '#ab240f',
        },
        mainCategory: {
          fontColor: '#ffffff',
          activeFontColor: '#2f2a26',
        },
        backgroundImg: 'https://static.torder.co.kr/torder2/img_background_black_1280px.svg',
        backgroundColor: '#2f2a26',
      },
      background: { backgroundColor: '#ffffff' },
      bottomNavbar: { backgroundColor: '#ffffff' },
    },
    [WHITE]: {
      staffCallButton: {
        backgroundColor: '#ab240f',
        fontColor: '#ffffff',
      },
      button: {
        backgroundColor: '#ab240f',
        fontColor: '#ffffff',
      },
      font: {
        color: '#000000',
        activeColor: '#ab240f',
      },
      tableNum: {
        backgroundColor: '#2f2a26',
        fontColor: '#ffffff',
      },
      category: {
        subCategory: {
          fontColor: '#000000',
          activeFontColor: '#ab240f',
        },
        mainCategory: {
          fontColor: '#ffffff',
          activeFontColor: '#2f2a26',
        },
        backgroundImg: 'https://static.torder.co.kr/torder2/img_background_black_1280px.svg',
        backgroundColor: '#2f2a26',
      },
      background: { backgroundColor: '#ffffff' },
      bottomNavbar: { backgroundColor: '#ffffff' },
    },
  },

  [RESTAURANT_HORIZONTAL_CARD]: {
    [BLACK]: {
      staffCallButton: {
        backgroundColor: '#ab240f',
        fontColor: '#ffffff',
      },
      button: {
        backgroundColor: '#ab240f',
        fontColor: '#ffffff',
      },
      font: {
        color: '#000000',
        activeColor: '#ab240f',
      },
      tableNum: {
        backgroundColor: '#2f2a26',
        fontColor: '#ffffff',
      },
      category: {
        subCategory: {
          fontColor: '#000000',
          activeFontColor: '#ab240f',
        },
        mainCategory: {
          fontColor: '#ffffff',
          activeFontColor: '#2f2a26',
        },
        backgroundImg: 'https://static.torder.co.kr/torder2/img_background_black_1280px.svg',
        backgroundColor: '#2f2a26',
      },
      background: { backgroundColor: '#ffffff' },
      bottomNavbar: { backgroundColor: '#ffffff' },
    },
    [WHITE]: {
      staffCallButton: {
        backgroundColor: '#ab240f',
        fontColor: '#ffffff',
      },
      button: {
        backgroundColor: '#ab240f',
        fontColor: '#ffffff',
      },
      font: {
        color: '#000000',
        activeColor: '#ab240f',
      },
      tableNum: {
        backgroundColor: '#2f2a26',
        fontColor: '#ffffff',
      },
      category: {
        subCategory: {
          fontColor: '#000000',
          activeFontColor: '#ab240f',
        },
        mainCategory: {
          fontColor: '#ffffff',
          activeFontColor: '#2f2a26',
        },
        backgroundImg: 'https://static.torder.co.kr/torder2/img_background_black_1280px.svg',
        backgroundColor: '#2f2a26',
      },
      background: { backgroundColor: '#ffffff' },
      bottomNavbar: { backgroundColor: '#ffffff' },
    },
  },
};

export default defaultThemeStyles;
