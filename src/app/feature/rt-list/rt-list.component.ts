import { Component } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { RtListService } from '../../services/rt-list/rt-list.service';
import { RtList } from '../../services/rt-list/rt-list.interface';
import { AvatarModule } from 'primeng/avatar';
import { GLOBAL } from '../../core/namespace/globals.namespace';
import { CommonModule } from '@angular/common';
import { CaptionComponent } from '../../shared/caption/caption.component';
import { SidebarModule } from 'primeng/sidebar';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { BlockUIModule } from 'primeng/blockui';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-rt-list',
  standalone: true,
  imports: [
    DataViewModule,
    AvatarModule,
    CommonModule,
    CaptionComponent,
    SidebarModule,
    CalendarModule,
    FormsModule,
    BlockUIModule,
    DialogModule,
    QRCodeModule,
  ],
  templateUrl: './rt-list.component.html',
  styleUrl: './rt-list.component.scss',
})
export class RtListComponent {
  list: RtList[] = [];
  shownList: RtList[] = [];
  sidebarVisible: boolean = false;
  selectedItem?: RtList;

  qrCodeVisible: boolean = false;

  GLOBAL = GLOBAL;

  isLoading = false;

  constructor(public rtListService: RtListService) {
    this.setRtList();
  }
  setRtList() {
    this.rtListService.getAllLinks().then((dbList: any) => {
      this.isLoading = true;
      let idx = 0;

      dbList.forEach((dbRow: any) => {
        this.rtListService.getInfoFromLink(dbRow.links).subscribe({
          next: (data: any) => {
            data = { ...data, ...dbRow };
            if (dbRow.date) {
              data.date = this.convertDate(dbRow.date);
            }
            this.list.push(data);
            this.shownList.push(data);
            idx++;
            if (idx === dbList.length) {
              this.isLoading = false;
            }
          },
          error: (err) => {
            console.log(err);
            idx++;
            if (idx === dbList.length) {
              this.isLoading = false;
            }
          },
        });
      });
    });
  }

  sortArr(ar: any[]) {
    return ar.sort((a: any, b: any) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
  }

  convertDate(str: string | Date) {
    if (typeof str === 'string') {
      let d = str.split('-').map((d) => parseInt(d));
      return new Date(d[0], d[1] - 1, d[2]);
    }
    return str;
  }

  getBackgroundColor(item: RtList) {
    if (
      this.isLastTrasmDue(item) ||
      this.isVersionsNotEq(item) ||
      this.isLastVerDue(item)
    ) {
      return '#f5d9124f';
    }
    return '#6ebe7150';
  }

  getBorderColor(item: RtList) {
    if (
      this.isLastTrasmDue(item) ||
      this.isVersionsNotEq(item) ||
      this.isLastVerDue(item)
    ) {
      return '#f5d912';
    }
    return '#6ebe71';
  }

  getMobileStyle(item: RtList) {
    return {
      'background-color': this.getBackgroundColor(item),
      'border-color': this.getBorderColor(item),
    };
  }

  getAvatarColor(item: RtList) {
    if (
      this.isLastTrasmDue(item) ||
      this.isVersionsNotEq(item) ||
      this.isLastVerDue(item)
    ) {
      return '#f5d912';
    }
    return '#6ebe71';
  }
  getAvtarStyle(item: RtList) {
    return {
      'background-color': this.getAvatarColor(item),
    };
  }

  getAvatarText(item: RtList) {
    if (
      this.isLastTrasmDue(item) ||
      this.isVersionsNotEq(item) ||
      this.isLastVerDue(item)
    ) {
      return 'WR';
    }
    return 'OK';
  }

  setFilter(event: any) {
    this.shownList = this.list
      .filter((item: RtList) => {
        if (event.nameFilter.length > 0) {
          return item.name
            .toLowerCase()
            .startsWith(event.nameFilter.toLowerCase());
        }
        return true;
      })
      .filter((item: RtList) => {
        if (event.versionsNotEq) {
          return this.isVersionsNotEq(item);
        }
        return true;
      })
      .filter((item: RtList) => {
        if (event.lastTrasmDue) {
          return this.isLastTrasmDue(item);
        }
        return true;
      })
      .filter((item: RtList) => {
        if (event.lastVerDue) {
          return this.isLastVerDue(item);
        }
        return true;
      })
      .filter((item: RtList) => {
        if (event.dateFilter) {
          return item.date?.getMonth() === event.dateFilter.getMonth();
        }
        return true;
      });
  }

  isLastVerDue(item: RtList) {
    const twoYearsMilli = 2 * 365 * 24 * 60 * 60 * 1000;
    return new Date().getTime() - item.lastVer.getTime() > twoYearsMilli;
  }
  isLastTrasmDue(item: RtList) {
    const twoWeeksMilli = 2 * 7 * 24 * 60 * 60 * 1000;
    return new Date().getTime() - item.lastTrasm.getTime() > twoWeeksMilli;
  }
  isVersionsNotEq(item: RtList) {
    return item.versDisp !== item.versModel;
  }

  onItemClick(item: RtList) {
    this.sidebarVisible = true;
    this.selectedItem = item;
  }
  changeDateItem(item: RtList, date: Date) {
    this.rtListService.editDateItem(item.link!, date);
  }

  getLastVerStyle(item: RtList) {
    if (this.isLastVerDue(item)) {
      return this.warningStyle;
    }
    return {};
  }
  getLastTrasmStyle(item: RtList) {
    if (this.isLastTrasmDue(item)) {
      return this.warningStyle;
    }
    return {};
  }

  getVersionsNotEqStyle(item: RtList) {
    if (this.isVersionsNotEq(item)) {
      return this.warningStyle;
    }
    return {};
  }

  get warningStyle() {
    return {
      'border-color': '#f5d912',
      'background-color': '#f5d9124f',
    };
  }
}
