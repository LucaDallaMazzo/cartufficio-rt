import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureRoutingModule } from './feature-routing.module';
import { RtListService } from '../services/rt-list/rt-list.service'


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FeatureRoutingModule
  ],
  providers:[RtListService]
})
export class FeatureModule { }
