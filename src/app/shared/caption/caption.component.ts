import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import {
  NgxScannerQrcodeModule,
  LOAD_WASM,
  NgxScannerQrcodeComponent,
  ScannerQRCodeDevice,
  ScannerQRCodeResult,
} from 'ngx-scanner-qrcode';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RtListService } from '../../services/rt-list/rt-list.service';
import { CarouselModule } from 'primeng/carousel';
import { GLOBAL } from '../../core/namespace/globals.namespace';

LOAD_WASM().subscribe();
@Component({
  selector: 'app-caption',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    CheckboxModule,
    CalendarModule,
    NgxScannerQrcodeModule,
    JsonPipe,
    AsyncPipe,
    DropdownModule,
    ButtonModule,
    CarouselModule,
  ],
  templateUrl: './caption.component.html',
  styleUrl: './caption.component.scss',
})
export class CaptionComponent {
  constructor(public rtListService: RtListService) {}

  GLOBAL = GLOBAL;

  nameFilter: string = '';
  lastVerDue: boolean = false;
  lastTrasmDue: boolean = false;
  versionsNotEq: boolean = false;
  dateFilter?: Date;

  addLink?: string;
  addDate?: Date;

  scannerEnabled = false;

  showFilters = false;
  showAdd = false;
  devices: MenuItem[] = [];

  letters = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  @Output() filterEdit = new EventEmitter<any>();

  setFilter() {
    this.filterEdit.emit({
      nameFilter: this.nameFilter,
      lastVerDue: this.lastVerDue,
      lastTrasmDue: this.lastTrasmDue,
      versionsNotEq: this.versionsNotEq,
      dateFilter: this.dateFilter,
    });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
    if (this.showFilters) this.showAdd = false;
  }

  toggleAdd() {
    this.showAdd = !this.showAdd;
    if (this.showAdd) this.showFilters = false;
    setTimeout(() => {
      this.enableScanner();
    }, 500);
  }

  @ViewChild('action') action?: NgxScannerQrcodeComponent;

  enableScanner() {
    this.scannerEnabled = !this.scannerEnabled;
    if (this.scannerEnabled) {
      this.handle(this.action, 'start');
    } else {
      this.action?.stop();
    }
  }

  public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: ScannerQRCodeDevice[]) => {
      const device = devices.find((f) =>
        /back|rear|environment|posteriore/gi.test(f.label),
      );
      this.devices = devices.map((d) => {
        return {
          label: d.label,
          value: d.deviceId,
        };
      });
    };

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe((r: any) =>
        console.log(fn, r),
      );
    }
  }

  onDeviceChange(deviceId: any) {
    this.action?.playDevice(deviceId.value);
  }

  onResponse(e: ScannerQRCodeResult[], action?: any): void {
    e && action && action.pause();
    this.addLink = action.data.value[0].value;
    if (this.addLink && this.addLink.length > 0) {
      action.stop();
    }
  }

  onAdd() {
    if (this.addLink && this.addDate)
      this.rtListService.addLink(this.addLink, this.addDate).then(() => {
        this.toggleAdd();
        this.addLink = undefined;
        this.addDate = undefined;
      });
  }

  onLetterClick(letter: string) {
    if (this.isLetterActive(letter)) {
      this.nameFilter = '';
    } else {
      this.nameFilter = letter;
    }
    this.setFilter();
  }

  isLetterActive(letter: string) {
    return this.nameFilter === letter;
  }
}
