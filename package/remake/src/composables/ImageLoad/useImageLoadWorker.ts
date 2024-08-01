// import {
//   ref,
//   reactive,
//   onBeforeUnmount,
//   onMounted,
// } from 'vue';

// interface ImageLoadWorkerOptions {
//   images: string[],
//   incrementalUpdate: boolean,
// }

// export default function useImageLoadWorker({
//   images,
//   incrementalUpdate,
// }: ImageLoadWorkerOptions) {
//   const imageBlobs = ref<string[]>([]);
//   const maxWorkers = navigator.hardwareConcurrency || 2;

//   const chunkSizeForWorker = Math.ceil(images.length / maxWorkers);

//   let workers = reactive<Worker[]>([]);

//   onMounted(() => {
//     if (workers.length === 0) {
//       workers = new Array(maxWorkers)
//         .fill(undefined)
//         .map(() => new Worker(new URL('./ImageLoadWorker.js', import.meta.url)));
//     }
//   });

//   onBeforeUnmount(() => {
//     workers.forEach((worker) => worker.terminate());
//   });

//   const revokeObjectUrls = (objectUrls: string[]) => {
//     if (objectUrls.length > 0) {
//       objectUrls.forEach((url) => {
//         if (url) {
//           URL.revokeObjectURL(url);
//         }
//       });
//     }
//   };

//   const loadAllImagesAtOnce = async (imageUrls: string[]) => {
//     if (window.Worker) {
//       revokeObjectUrls(imageBlobs.value);
//       imageBlobs.value = new Array(imageUrls.length).fill(undefined);

//       const imageChunks: string[][] = [];

//       for (let i = 0; i < maxWorkers; i++) {
//         const startIndex = i * chunkSizeForWorker;
//         imageChunks.push(imageUrls.slice(startIndex, startIndex + chunkSizeForWorker));
//       }

//       const imagePromises = imageChunks.map((chunk, chunkIndex) => new Promise<string[]>((resolve) => {
//         const chunkWorker = workers[chunkIndex];

//         if (chunkWorker) {
//           chunkWorker.postMessage(chunk);

//           chunkWorker.onmessage = (e) => {
//             resolve(e.data);
//           };
//         }
//       }));

//       const imageBlobsChunks = await Promise.all(imagePromises);

//       const allImageBlobs = imageBlobsChunks.reduce(
//         (result, chunk) => [
//           ...result,
//           ...chunk,
//         ],
//         [],
//       );

//       imageBlobs.value = allImageBlobs;
//     }
//   };

//   const loadImagesIncrementally = async (imageUrls: string[]) => {
//     if (window.Worker && workers.length) {
//       const imageBlobsArray = new Array(imageUrls.length).fill(undefined);
//       imageBlobs.value = imageBlobsArray;

//       const imageChunks: string[][] = [];

//       for (let i = 0; i < maxWorkers; i++) {
//         const startIndex = i * chunkSizeForWorker;
//         imageChunks.push(imageUrls.slice(startIndex, startIndex + chunkSizeForWorker));
//       }

//       const imagePromises = imageChunks.map((chunk, chunkIndex) => new Promise<{ imageUrls: string[]; chunkIndex: number }>((resolve) => {
//         const chunkWorker = workers[chunkIndex];

//         if (chunkWorker) {
//           chunkWorker.postMessage(chunk);

//           chunkWorker.onmessage = (e) => {
//             resolve({
//               imageUrls: e.data,
//               chunkIndex,
//             });
//           };
//         }
//       }));

//       imagePromises.forEach(async (imagePromise) => {
//         try {
//           const {
//             imageUrls,
//             chunkIndex,
//           } = await imagePromise;

//           imageUrls.forEach((url, index) => {
//             imageBlobsArray[chunkIndex * chunkSizeForWorker + index] = url;
//           });

//           imageBlobs.value = [...imageBlobsArray];
//         } catch (e) {
//           console.error(e);
//         }
//       });
//     }
//   };

//   onMounted(() => {
//     if (incrementalUpdate) {
//       loadImagesIncrementally(images);
//     } else {
//       loadAllImagesAtOnce(images);
//     }
//   });

//   return {
//     imageBlobs,
//     maxWorkers,
//   };
// }
