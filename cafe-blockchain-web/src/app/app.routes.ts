import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'dashboard', loadComponent: () => import('@features/dashboard/pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'pos', loadComponent: () => import('@features/pos/pages/pos/pos.component').then(m => m.PosComponent) },
  { path: 'menu', loadComponent: () => import('@features/pos/pages/menu/menu.component').then(m => m.MenuComponent) },
  { path: 'orders', loadComponent: () => import('@features/pos/pages/orders/orders.component').then(m => m.OrdersComponent) },
  { path: 'settings', loadComponent: () => import('@features/settings/settings.component').then(m => m.SettingsComponent) },
  { path: 'customers', loadComponent: () => import('@features/customers/customers.component').then(m => m.CustomersComponent) },
  { path: 'financials', loadComponent: () => import('@features/financials/financials.component').then(m => m.FinancialsComponent) },
  { path: 'inventory', loadComponent: () => import('@features/pos/pages/inventory/inventory.component').then(m => m.InventoryComponent) },
  { path: 'tables', loadComponent: () => import('@features/pos/pages/tables/tables.component').then(m => m.TablesComponent) },
  { path: 'reports', loadComponent: () => import('@features/reports/reports.component').then(m => m.ReportsComponent) },
  { path: 'debts', loadComponent: () => import('@features/pos/pages/debts/debts.component').then(m => m.DebtsComponent) },
  { path: 'staffs', loadComponent: () => import('@features/staffs/staffs.component').then(m => m.StaffsComponent) },
  { path: 'mobile-sign', loadComponent: () => import('@features/auth/pages/mobile-sign/mobile-sign.component').then(m => m.MobileSignComponent) },
  { path: 'blockchain-explorer', loadComponent: () => import('@features/blockchain/pages/blockchain-explorer/blockchain-explorer.component').then(m => m.BlockchainExplorerComponent) },
  { path: 'store/:slug', loadComponent: () => import('@features/storefront/pages/store/store.component').then(m => m.StoreComponent) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];


