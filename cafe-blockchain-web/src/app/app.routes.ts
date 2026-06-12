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
import { MobileSignComponent } from './components/mobile-sign/mobile-sign.component';
import { BlockchainExplorerComponent } from './components/blockchain-explorer/blockchain-explorer.component';
import { StoreComponent } from './components/store/store.component';
import { ReportsComponent } from './components/reports/reports.component';
import { DebtsComponent } from './components/debts/debts.component';

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
  { path: 'reports', component: ReportsComponent },
  { path: 'debts', component: DebtsComponent },
  { path: 'mobile-sign', component: MobileSignComponent },
  { path: 'blockchain-explorer', component: BlockchainExplorerComponent },
  { path: 'store/:slug', component: StoreComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];

