import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureRoutingModule } from './feature-routing.module';
import { CashRegisterService } from '../services/rt-list/rt-list.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, FeatureRoutingModule],
  providers: [CashRegisterService],
})
export class FeatureModule {}
