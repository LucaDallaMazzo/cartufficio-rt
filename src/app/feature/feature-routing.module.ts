import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { RtListComponent } from './rt-list/rt-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'rt-list', pathMatch: 'full' },
  { path: 'rt-list', component: RtListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureRoutingModule {}
