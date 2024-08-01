export type SyncFile = {
  url: string,
  fileName: string,
  fileSize: number,
  force: boolean,
}

export const SERVING_ROBOT_AUDIO: SyncFile[] = [{
  url: 'https://static.torder.co.kr/torder2/serving_robot_arrived.mp3',
  fileName: 'serving_robot_arrived.mp3',
  fileSize: 24400,
  force: false,
}];

export const files: SyncFile[] = [
  {
    url: 'http://example.com/audio1.mp3',
    fileName: 'audio1.mp3',
    fileSize: 1024,
    force: true,
  },
  {
    url: 'http://example.com/audio2.mp3',
    fileName: 'audio2.mp3',
    fileSize: 2048,
    force: false,
  },
];
