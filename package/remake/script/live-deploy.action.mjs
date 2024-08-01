import fs from 'fs';
import {
  putObject,
  // invalidateCloudFrontCache,
  putObjectFile,
  getSingleObject,
  // eslint-disable-next-line import/extensions
} from './utils/aws.mjs';

// const { AWS_DISTRIBUTION_ID } = process.env;

const getNextVersion = async () => {
  const CURRENT_VERSION_KEY = 'currentVersion.json';

  // S3에서 현재 버전 정보를 가져옵니다.
  const latestVersionData = await getSingleObject(CURRENT_VERSION_KEY);

  let currentVersion = {
    major: 1,
    minor: 0,
    patch: 0,
  };

  // 만약 오브젝트가 있다면 JSON 데이터를 파싱하여 현재 버전 정보를 가져옵니다.
  if (latestVersionData) {
    currentVersion = JSON.parse(latestVersionData);
    currentVersion.patch += 1;
  }

  // 새로운 버전 정보를 S3에 저장합니다.
  await putObjectFile(CURRENT_VERSION_KEY, Buffer.from(JSON.stringify(currentVersion)));

  console.log(`업데이트 버전: v/${currentVersion.major}/${currentVersion.minor}/${currentVersion.patch}`);

  return currentVersion;
};

const uploadFileToS3 = async (dirName, fileName, removePath, versions) => {
  const replaceDirName = `v/${versions.major}/${versions.minor}/${versions.patch}/${dirName.replace(removePath, '')}`;

  const data = fs.readFileSync(`${dirName}/${fileName}`);
  return putObject(replaceDirName, fileName, data);
};

const convertFileList = (pathName, removePath, promiseList, versions) => {
  const isExistFile = fs.existsSync(pathName);

  if (!isExistFile) return;

  const fileList = fs.readdirSync(pathName);

  fileList.forEach((fileName) => {
    const realPathName = `${pathName}/${fileName}`;
    if (fs.lstatSync(realPathName).isDirectory()) {
      convertFileList(realPathName, removePath, promiseList);
      return;
    }

    promiseList.push(uploadFileToS3(pathName, fileName, removePath, versions));
  });
};

async function main() {
  const versions = await getNextVersion();

  // dist 파일 업로드
  const uploadDir = [
    'assets',
    'fonts',
  ];

  const promises = uploadDir.map((dirName) => {
    const removePath = './dist/';
    const promiseList = [];

    convertFileList(`${removePath}${dirName}`, removePath, promiseList, versions);
    return promiseList;
  }).flat();

  const htmlFile = fs.readFileSync('./dist/index.html');

  const putHtmlList = putObject(`v/${versions.major}/${versions.minor}/${versions.patch}`, 'index.html', htmlFile);

  promises.push(putHtmlList);

  // 업로드 로직 종료시까지 대기
  await Promise.all(promises);

  // 버저닝 도입으로 인한 클라우드프론트 캐시 무효화 로직 제거.
  // if (AWS_DISTRIBUTION_ID) {
  //   await invalidateCloudFrontCache(5, AWS_DISTRIBUTION_ID);
  // }
}

await main();
