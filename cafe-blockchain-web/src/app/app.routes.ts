import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PosComponent } from './components/pos/pos.component';
import { MenuComponent } from './components/menu/menu.component';
import { OrdersComponent } from './components/orders/orders.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CustomersComponent } from './components/customers/customers.component';
import { FinancialsComponent } from './components/financials/financials.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { TablesComponent } from './components/tables/tables.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'pos', component: PosComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'financials', component: FinancialsComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'tables', component: TablesComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
