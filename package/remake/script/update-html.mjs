import fs from 'fs';

const htmlPath = '../../package/remake/dist/index.html';

fs.readFile(htmlPath, 'utf8', (err, data) => {
  const targetString = '.js"></script>';
  const replacementString = '.js" onerror="handleScriptError()"></script>';

  const updatedData = data.replace(targetString, replacementString);

  fs.writeFile(htmlPath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('에러 :', err);
    } else {
      console.log('index.html 업데이트 성공');
    }
  });
});
