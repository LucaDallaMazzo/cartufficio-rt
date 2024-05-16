import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CashRegister } from './rt-list.interface';
import { DbRow } from './db-row.interface';

@Injectable()
export class CashRegisterService {
  private supabase: SupabaseClient;

  constructor(private http: HttpClient) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
    );
  }

  async getAllLinks() {
    const { data, error } = await this.supabase.from('links').select('*');
    if (error) {
      throw error;
    }
    return data as DbRow[];
  }

  getInfoFromLink(dbRow: DbRow): Observable<CashRegister> {
    return this.http.get(dbRow.links, { responseType: 'text' }).pipe(
      map((value) => {
        return new CashRegister({
          ...this.rtListConverter(value),
          link: dbRow.links,
          date: dbRow.date,
        });
      }),
    );
  }

  async editDateItem(link: string, date: Date) {
    const { data, error } = await this.supabase
      .from('links')
      .update({ date: date })
      .eq('links', link);
    if (error) {
      throw error;
    }
    return data;
  }

  async addLink(link: string, date: Date) {
    const { data, error } = await this.supabase
      .from('links')
      .insert({ links: link, date });
    if (error) {
      throw error;
    }
    return data;
  }

  rtListConverter(htmlText: string): CashRegister {
    const indexes: { [key: string]: { index: number; removeStr: string } } = {
      matricola: { index: 0, removeStr: 'Matricola: ' },
      stato: { index: 1, removeStr: 'Stato: ' },
      esito: { index: 14, removeStr: '' },
      name: { index: 30, removeStr: 'Denominazione: ' },
      lastVer: { index: 13, removeStr: 'Data: ' },
      lastVerLab: { index: 15, removeStr: 'PIVA Laboratorio: ' },
      lastVerTec: { index: 16, removeStr: 'CF Tecnico: ' },
      lastTrasm: { index: 18, removeStr: 'Data: ' },
      versDisp: { index: 21, removeStr: 'Versione: ' },
      versModel: { index: 25, removeStr: 'Versione: ' },
    };
    let ret: Partial<CashRegister> = {};
    let html = document.createElement('div');
    html.innerHTML = htmlText;
    let lis = html.getElementsByTagName('li');
    Object.keys(indexes).forEach((k) => {
      let index = indexes[k].index;
      let removeStr = indexes[k].removeStr;
      let value: string | Date = lis[index]?.innerText
        ?.trim()
        ?.replace(removeStr, '');
      if (
        k?.includes('last') &&
        value?.includes('/') &&
        k != 'lastVerLab' &&
        k != 'lastVerTec'
      ) {
        let date = value.split('/').map((d) => parseInt(d));
        value = new Date(date[2], date[1] - 1, date[0]);
      }
      ret = { ...ret, [k]: value };
    });
    return ret as CashRegister;
  }
}
