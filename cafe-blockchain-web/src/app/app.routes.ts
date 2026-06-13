import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PosComponent } from './pages/pos/pos.component';
import { MenuComponent } from './pages/menu/menu.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { FinancialsComponent } from './pages/financials/financials.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { TablesComponent } from './pages/tables/tables.component';
import { MobileSignComponent } from './pages/mobile-sign/mobile-sign.component';
import { BlockchainExplorerComponent } from './pages/blockchain-explorer/blockchain-explorer.component';
import { StoreComponent } from './pages/store/store.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { DebtsComponent } from './pages/debts/debts.component';

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

