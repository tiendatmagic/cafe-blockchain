import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'dashboard', loadComponent: () => import('@pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'pos', loadComponent: () => import('@pages/pos/pos.component').then(m => m.PosComponent) },
  { path: 'menu', loadComponent: () => import('@pages/menu/menu.component').then(m => m.MenuComponent) },
  { path: 'orders', loadComponent: () => import('@pages/orders/orders.component').then(m => m.OrdersComponent) },
  { path: 'settings', loadComponent: () => import('@pages/settings/settings.component').then(m => m.SettingsComponent) },
  { path: 'customers', loadComponent: () => import('@pages/customers/customers.component').then(m => m.CustomersComponent) },
  { path: 'financials', loadComponent: () => import('@pages/financials/financials.component').then(m => m.FinancialsComponent) },
  { path: 'inventory', loadComponent: () => import('@pages/inventory/inventory.component').then(m => m.InventoryComponent) },
  { path: 'tables', loadComponent: () => import('@pages/tables/tables.component').then(m => m.TablesComponent) },
  { path: 'reports', loadComponent: () => import('@pages/reports/reports.component').then(m => m.ReportsComponent) },
  { path: 'debts', loadComponent: () => import('@pages/debts/debts.component').then(m => m.DebtsComponent) },
  { path: 'staffs', loadComponent: () => import('@pages/staffs/staffs.component').then(m => m.StaffsComponent) },
  { path: 'mobile-sign', loadComponent: () => import('@pages/mobile-sign/mobile-sign.component').then(m => m.MobileSignComponent) },
  { path: 'blockchain-explorer', loadComponent: () => import('@pages/blockchain-explorer/blockchain-explorer.component').then(m => m.BlockchainExplorerComponent) },
  { path: 'store/:slug', loadComponent: () => import('@pages/store/store.component').then(m => m.StoreComponent) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];


