import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { rtListConverter } from './rt-list.converter';
import { RtList } from './rt-list.interface';

@Injectable()
export class RtListService {
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
    return data;
  }

  getInfoFromLink(link: string): Observable<RtList> {
    return this.http.get(link, { responseType: 'text' }).pipe(
      map((value) => {
        return { ...rtListConverter(value), link };
      }),
    );
  }

  async editDateItem(link: string,date:Date) {
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
      .insert({ links: link,date });
    if (error) {
      throw error;
    }
    return data;
  }
}
