// self.addEventListener('message', async (e: MessageEvent<string[]>) => {
//   const urls = e.data; // 메인 스레드로부터 전달받은 이미지 URL 배열

//   console.log('active worker');
//   const images = await Promise.all(
//     urls.map(async (url) => {
//       try {
//         // const response = await fetch(url);
//         const fileBlob = await url.blob();

//         console.log(url);
//         if (/image\/.+/.test(fileBlob.type)) {
//           return URL.createObjectURL(fileBlob);
//         }
//       } catch (e) {
//         return null;
//       }
//     }),
//   );

//   self.postMessage(images);
// });
