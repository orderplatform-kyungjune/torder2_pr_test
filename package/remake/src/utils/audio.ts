import { SyncFile } from '@torder/common/constant/audio';

export const useSyncAudioAOS = (files: SyncFile[]) => {
  if (!Array.isArray(files)) return;

  const syncFilesFormat = {
    syncFiles: files.map((file) => ({
      url: file.url,
      path: 'audio/',
      fileName: file.fileName,
      fileSize: file.fileSize,
      option: { force: file.force },
    })),
  };

  window.UUID?.syncFiles(syncFilesFormat);
};

export const usePlayAosAudio = (path: string, volume: number = 100) => {
  const audioOption = { volume };

  window.UUID?.playAudio(path, audioOption);
};
