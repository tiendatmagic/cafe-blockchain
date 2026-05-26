import { Routes } from '@angular/router';
import { App } from './app';

export const routes: Routes = [
  { path: 'dashboard', component: App },
  { path: 'pos', component: App },
  { path: 'menu', component: App },
  { path: 'orders', component: App },
  { path: 'settings', component: App },
  { path: 'customers', component: App },
  { path: 'financials', component: App },
  { path: 'inventory', component: App },
  { path: 'tables', component: App },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
