import { v4 } from 'uuid';
import { U_CODE } from '../constant/string';
import {
  getStorage,
  setStorage,
} from './storageUtils';

export const generateUcode = () => {
  const getUCode = getStorage(U_CODE);

  if (getUCode === null) {
    const uuid4 = v4();
    setStorage('uCode', uuid4);
  }
};

export default generateUcode;
