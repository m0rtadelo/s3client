import { i18n } from '../services/i18';

const toExcel = require('to-excel').toExcel;

export const exportExcel = (title = 'undefined', data: any, headers: any = []): void => {
  if (data?.length) {
    if (!headers.length) {
      Object.keys(data[0]).forEach((hdr) => {
        headers.push({
          label: i18n.get(hdr),
          field: hdr,
        });
      });
    }
    toExcel.exportXLS(headers, data, title);
  }
};
