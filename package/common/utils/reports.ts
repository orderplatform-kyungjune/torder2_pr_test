import { PathReporter } from 'io-ts/lib/PathReporter';
import { Validation } from 'io-ts';
import { iTypeError } from '../interface/reports';

const getTypeError = (errors: Validation<unknown>): iTypeError => {
  const reports = PathReporter.report(errors);
  const defineReports = reports.map((report) => {
    const regex = /(?:value) (.*)(?: supplied)(?:.*)(?:}\/)(.*): (.*)/g;
    const groupReport = regex.exec(report);

    if (groupReport === null) {
      const notFoundProperty = report.split(' ')[2];

      return notFoundProperty;
    }

    const value = groupReport[1].replaceAll('"', '');
    const property = groupReport[2];
    const type = groupReport[3];
    const result = {
      프로퍼티: property,
      '예상한 타입': type,
      값: value,
    };

    return result;
  });

  return defineReports;
};

export default getTypeError;
