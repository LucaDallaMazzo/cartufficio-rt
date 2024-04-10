import { RtList } from './rt-list.interface';

const indexes: { [key: string]: { index: number; removeStr: string } } = {
  matricola: { index: 0, removeStr: 'Matricola: ' },
  stato: { index: 1, removeStr: 'Stato: ' },
  esito: { index: 14, removeStr: '' },
  name: { index: 30, removeStr: 'Denominazione: ' },
  lastVer: { index: 13, removeStr: 'Data: ' },
  lastTrasm: { index: 18, removeStr: 'Data: ' },
  versDisp: { index: 21, removeStr: 'Versione: ' },
  versModel: { index: 25, removeStr: 'Versione: ' },
};
export function rtListConverter(htmlText: string): RtList {
  let ret: Partial<RtList> = {};
  let html = document.createElement('div');
  html.innerHTML = htmlText;
  let lis = html.getElementsByTagName('li');
  Object.keys(indexes).forEach((k) => {
    let index = indexes[k].index;
    let removeStr = indexes[k].removeStr;
    let value: string | Date = lis[index]?.innerText
      .trim()
      .replace(removeStr, '');
    if (k.includes('last')) {
      let date = value.split('/').map((d) => parseInt(d));
      value = new Date(date[2], date[1] - 1, date[0]);
    }
    ret = { ...ret, [k]: value };
  });
  return ret as RtList;
}
