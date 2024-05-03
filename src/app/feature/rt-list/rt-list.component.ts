import { Component } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { CashRegisterService } from '../../services/rt-list/rt-list.service';
import { CashRegister } from '../../services/rt-list/rt-list.interface';
import { AvatarModule } from 'primeng/avatar';
import { GLOBAL } from '../../core/namespace/globals.namespace';
import { CommonModule } from '@angular/common';
import { CaptionComponent } from '../../shared/caption/caption.component';
import { SidebarModule } from 'primeng/sidebar';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { BlockUIModule } from 'primeng/blockui';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { QRCodeModule } from 'angularx-qrcode';
import { DbRow } from '../../services/rt-list/db-row.interface';

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
    TableModule,
  ],
  templateUrl: './rt-list.component.html',
  styleUrl: './rt-list.component.scss',
})
export class RtListComponent {
  list: CashRegister[] = [];
  shownList: CashRegister[] = [];
  sidebarVisible: boolean = false;
  selectedItem?: CashRegister;

  qrCodeVisible: boolean = false;
  qrCodeLink?: string = '';
  qrCodeName?: string = '';

  GLOBAL = GLOBAL;

  isLoading = false;

  constructor(public cashRegisterService: CashRegisterService) {
    this.setAllRegisters();
  }

  get gridClass() {
    let clazz = ['grid', 'grid-nogutter'];
    if (!GLOBAL.MOBILE) clazz.push('flex-row');
    return clazz.join(' ');
  }
  get elClass() {
    return GLOBAL.MOBILE ? 'col-12' : 'col-6';
  }

  setAllRegisters() {
    this.cashRegisterService.getAllLinks().then((dbList: DbRow[]) => {
      this.isLoading = true;
      let idx = 0;

      dbList.forEach((dbRow: DbRow) => {
        this.cashRegisterService.getInfoFromLink(dbRow).subscribe({
          next: (data: CashRegister) => {
            this.list.push(data);
            this.shownList.push(data);
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            idx++;
            if (idx === dbList.length) {
              this.isLoading = false;
            }
          },
        });
      });
    });
  }

  sortArr(ar: CashRegister[]) {
    return ar.sort((a: CashRegister, b: CashRegister) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
  }

  getBackgroundColor(item: CashRegister) {
    if (item.isWarning) {
      return '#f5d9124f';
    }
    return '#6ebe7150';
  }

  getBorderColor(item: CashRegister) {
    if (item.isWarning) {
      return '#f5d912';
    }
    return '#6ebe71';
  }

  getMobileStyle(item: CashRegister) {
    return {
      'background-color': this.getBackgroundColor(item),
      'border-color': this.getBorderColor(item),
    };
  }

  getAvatarColor(item: CashRegister) {
    if (item.isWarning) {
      return '#f5d912';
    }
    return '#6ebe71';
  }
  getAvatarStyle(item: CashRegister) {
    return {
      'background-color': this.getAvatarColor(item),
    };
  }

  getAvatarText(item: CashRegister) {
    if (item.isWarning) {
      return 'WR';
    }
    return 'OK';
  }

  setFilter(event: any) {
    this.shownList = this.list
      .filter((item: CashRegister) => {
        if (event.nameFilter.length > 0) {
          if (event.nameFilter.length < 3)
            return item.name
              ?.toLowerCase()
              .startsWith(event.nameFilter.toLowerCase());
          return item.name
            ?.toLowerCase()
            .includes(event.nameFilter.toLowerCase());
        }
        return true;
      })
      .filter((item: CashRegister) => {
        if (event.versionsNotEq) {
          return item.isVersionsNotEq;
        }
        return true;
      })
      .filter((item: CashRegister) => {
        if (event.lastTrasmDue) {
          return item.isLastTrasmDue;
        }
        return true;
      })
      .filter((item: CashRegister) => {
        if (event.lastVerDue) {
          return item.isLastVerDue;
        }
        return true;
      })
      .filter((item: CashRegister) => {
        if (event.dateFilter) {
          return item.date?.getMonth() === event.dateFilter.getMonth();
        }
        return true;
      });
  }

  onItemClick(item: CashRegister) {
    this.sidebarVisible = true;
    this.selectedItem = item;
  }
  changeDateItem(item: CashRegister, date: Date) {
    this.cashRegisterService.editDateItem(item.link!, date);
  }

  getLastVerStyle(item: CashRegister) {
    if (item.isLastVerDue) {
      return this.warningStyle;
    }
    return {};
  }
  getLastTrasmStyle(item: CashRegister) {
    if (item.isLastTrasmDue) {
      return this.warningStyle;
    }
    return {};
  }

  getVersionsNotEqStyle(item: CashRegister) {
    if (item.isVersionsNotEq) {
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

  toggleQrCode(item?: CashRegister) {
    if (!item) return;
    this.qrCodeVisible = true;
    this.qrCodeLink = item.link;
    this.qrCodeName = item.name;
  }
}
