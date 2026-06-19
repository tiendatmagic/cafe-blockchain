import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'dashboard', loadComponent: () => import('@features/dashboard/pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'pos', loadComponent: () => import('@features/pos/pages/pos/pos.component').then(m => m.PosComponent) },
  { path: 'menu', loadComponent: () => import('@features/menu/menu.component').then(m => m.MenuComponent) },
  { path: 'orders', loadComponent: () => import('@features/orders/orders.component').then(m => m.OrdersComponent) },
  { path: 'settings', loadComponent: () => import('@features/settings/settings.component').then(m => m.SettingsComponent) },
  { path: 'customers', loadComponent: () => import('@features/customers/customers.component').then(m => m.CustomersComponent) },
  { path: 'financials', loadComponent: () => import('@features/financials/financials.component').then(m => m.FinancialsComponent) },
  { path: 'inventory', loadComponent: () => import('@features/inventory/inventory.component').then(m => m.InventoryComponent) },
  { path: 'tables', loadComponent: () => import('@features/tables/tables.component').then(m => m.TablesComponent) },
  { path: 'reports', loadComponent: () => import('@features/reports/reports.component').then(m => m.ReportsComponent) },
  { path: 'debts', loadComponent: () => import('@features/debts/debts.component').then(m => m.DebtsComponent) },
  { path: 'staffs', loadComponent: () => import('@features/staffs/staffs.component').then(m => m.StaffsComponent) },
  { path: 'shifts', loadComponent: () => import('@features/shifts/shifts.component').then(m => m.ShiftsComponent) },
  { path: 'mobile-sign', loadComponent: () => import('@features/auth/pages/mobile-sign/mobile-sign.component').then(m => m.MobileSignComponent) },
  { path: 'blockchain-explorer', loadComponent: () => import('@features/blockchain/pages/blockchain-explorer/blockchain-explorer.component').then(m => m.BlockchainExplorerComponent) },
  { path: 'claim-points', loadComponent: () => import('@features/claim-points/claim-points.component').then(m => m.ClaimPointsComponent) },
  { path: 'marketplace', loadComponent: () => import('@features/marketplace/marketplace.component').then(m => m.MarketplaceComponent) },
  { path: 'store/:slug', loadComponent: () => import('@features/storefront/pages/store/store.component').then(m => m.StoreComponent) },
  { path: 'admin', loadComponent: () => import('@features/admin/admin-saas.component').then(m => m.AdminSaaSComponent) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];


