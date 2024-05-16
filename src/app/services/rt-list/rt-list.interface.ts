import { TIMESTAMPS } from '../timestamps/timestamps.namespace';

export interface ICashRegister {
  matricola: string;
  stato: string;
  esito: string;
  name: string;
  lastVer: Date;
  lastTrasm: Date;
  lastVerLab: string;
  lastVerTec: string;
  versDisp: string;
  versModel: string;
  link?: string;
  date?: Date | string;
}

export class CashRegister {
  matricola: string;
  stato: string;
  esito: string;
  name: string;
  lastVer: Date;
  lastTrasm: Date;
  lastVerLab: string;
  lastVerTec: string;
  versDisp: string;
  versModel: string;
  link?: string;
  date?: Date;
  constructor(cashRegister: ICashRegister) {
    this.matricola = cashRegister.matricola?.trim();
    this.stato = cashRegister.stato?.trim();
    this.esito = cashRegister.esito?.trim();
    this.name = cashRegister.name?.trim();
    this.lastVer = cashRegister.lastVer;
    this.lastTrasm = cashRegister.lastTrasm;
    this.lastVerLab = cashRegister.lastVerLab?.trim();
    this.lastVerTec = cashRegister.lastVerTec?.trim();
    this.versDisp = cashRegister.versDisp?.trim();
    this.versModel = cashRegister.versModel?.trim();
    this.link = cashRegister.link?.trim();
    if (cashRegister.date) {
      this.date = this.convertDate(cashRegister.date ?? new Date(0));
    }
  }

  convertDate(str: string | Date) {
    if (typeof str === 'string') {
      let d = str.split('-').map((d) => parseInt(d));
      return new Date(d[0], d[1] - 1, d[2]);
    }
    return str;
  }

  get isLastTrasmDue() {
    return (
      new Date().getTime() - this.lastTrasm.getTime() > TIMESTAMPS.weeks(1)
    );
  }

  get isLastVerDue() {
    return new Date().getTime() - this.lastVer.getTime() > TIMESTAMPS.years(2);
  }

  get isVersionsNotEq() {
    return this.versDisp !== this.versModel;
  }

  get isWarning() {
    return this.isLastTrasmDue || this.isVersionsNotEq || this.isLastVerDue;
  }
}
