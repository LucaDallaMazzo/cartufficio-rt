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
    this.matricola = cashRegister.matricola;
    this.stato = cashRegister.stato;
    this.esito = cashRegister.esito;
    this.name = cashRegister.name;
    this.lastVer = cashRegister.lastVer;
    this.lastTrasm = cashRegister.lastTrasm;
    this.lastVerLab = cashRegister.lastVerLab;
    this.lastVerTec = cashRegister.lastVerTec;
    this.versDisp = cashRegister.versDisp;
    this.versModel = cashRegister.versModel;
    this.link = cashRegister.link;
    if (cashRegister.date) {
      this.date = this.convertDate(cashRegister.date);
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
    const twoWeeksMilli = 2 * 7 * 24 * 60 * 60 * 1000;
    return new Date().getTime() - this.lastTrasm.getTime() > twoWeeksMilli;
  }

  get isLastVerDue() {
    const twoYearsMilli = 2 * 365 * 24 * 60 * 60 * 1000;
    return new Date().getTime() - this.lastVer.getTime() > twoYearsMilli;
  }

  get isVersionsNotEq() {
    return this.versDisp !== this.versModel;
  }

  get isWarning() {
    return this.isLastTrasmDue || this.isVersionsNotEq || this.isLastVerDue;
  }
}
