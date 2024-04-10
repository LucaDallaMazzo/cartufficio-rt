import { Routes } from '@angular/router'

export const routes: Routes = [
  // { path: '', redirectTo: 'feature', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./feature/feature.module').then((m) => m.FeatureModule)
  }
]
