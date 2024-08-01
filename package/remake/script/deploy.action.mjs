import fs from 'fs';
import {
  putObject,
  invalidateCloudFrontCache,
  // eslint-disable-next-line import/extensions
} from './utils/aws.mjs';

const { AWS_DISTRIBUTION_ID } = process.env;

const uploadFileToS3 = (dirName, fileName, removePath) => {
  const replaceDirName = dirName.replace(removePath, '');

  const data = fs.readFileSync(`${dirName}/${fileName}`);

  return putObject(replaceDirName, fileName, data);
};

const convertFileList = (pathName, removePath, promiseList) => {
  const isExistFile = fs.existsSync(pathName);

  if (!isExistFile) return;

  const fileList = fs.readdirSync(pathName);

  fileList.forEach((fileName) => {
    const realPathName = `${pathName}/${fileName}`;
    if (fs.lstatSync(realPathName).isDirectory()) {
      convertFileList(realPathName, removePath, promiseList);
      return;
    }

    promiseList.push(uploadFileToS3(pathName, fileName, removePath));
  });
};

async function main() {
  // dist 파일 업로드
  const uploadDir = [
    'assets',
    'fonts',
  ];

  // js, css, img 디렉토리 파일 업로드
  const promises = uploadDir.map((dirName) => {
    const removePath = './dist/';

    const promiseList = [];

    convertFileList(`${removePath}${dirName}`, removePath, promiseList);

    return promiseList;
  }).flat();

  // index.html 업로드
  const htmlFile = fs.readFileSync('./dist/index.html');
  const putHtmlList = putObject('', 'index.html', htmlFile);
  promises.push(putHtmlList);

  // 업로드 로직 종료시까지 대기
  await Promise.all(promises);

  if (AWS_DISTRIBUTION_ID) {
    invalidateCloudFrontCache(5, AWS_DISTRIBUTION_ID);
  }
}

main();
