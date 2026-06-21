import { Routes } from '@angular/router';
import { FeatureGuard } from './core/guards/feature.guard';

export const routes: Routes = [
  { path: 'dashboard', canActivate: [FeatureGuard], data: { featureKey: 'enable_dashboard', featureName: 'Tổng quan' }, loadComponent: () => import('@features/dashboard/pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'pos', canActivate: [FeatureGuard], data: { featureKey: 'enable_pos', featureName: 'Bán hàng POS' }, loadComponent: () => import('@features/pos/pages/pos/pos.component').then(m => m.PosComponent) },
  { path: 'menu', canActivate: [FeatureGuard], data: { featureKey: 'enable_menu', featureName: 'Quản lý Thực đơn' }, loadComponent: () => import('@features/menu/menu.component').then(m => m.MenuComponent) },
  { path: 'orders', canActivate: [FeatureGuard], data: { featureKey: 'enable_orders', featureName: 'Đơn hàng' }, loadComponent: () => import('@features/orders/orders.component').then(m => m.OrdersComponent) },
  { path: 'settings', loadComponent: () => import('@features/settings/settings.component').then(m => m.SettingsComponent) },
  { 
    path: 'profile', 
    loadComponent: () => import('@features/profile/profile.component').then(m => m.ProfileComponent),
    children: [
      { path: 'info', loadComponent: () => import('@features/profile/pages/profile-info/profile-info.component').then(m => m.ProfileInfoComponent) },
      { path: 'settings', loadComponent: () => import('@features/profile/pages/profile-settings/profile-settings.component').then(m => m.ProfileSettingsComponent) },
      { path: '', redirectTo: 'info', pathMatch: 'full' }
    ]
  },
  { path: 'customers', canActivate: [FeatureGuard], data: { featureKey: 'enable_customers', featureName: 'Khách hàng' }, loadComponent: () => import('@features/customers/customers.component').then(m => m.CustomersComponent) },
  { path: 'financials', canActivate: [FeatureGuard], data: { featureKey: 'enable_financials', featureName: 'Thu chi tài chính' }, loadComponent: () => import('@features/financials/financials.component').then(m => m.FinancialsComponent) },
  { path: 'inventory', canActivate: [FeatureGuard], data: { featureKey: 'enable_inventory', featureName: 'Kho hàng' }, loadComponent: () => import('@features/inventory/inventory.component').then(m => m.InventoryComponent) },
  { path: 'tables', canActivate: [FeatureGuard], data: { featureKey: 'enable_tables', featureName: 'Sơ đồ bàn' }, loadComponent: () => import('@features/tables/tables.component').then(m => m.TablesComponent) },
  { path: 'reports', canActivate: [FeatureGuard], data: { featureKey: 'enable_reports', featureName: 'Báo cáo' }, loadComponent: () => import('@features/reports/reports.component').then(m => m.ReportsComponent) },
  { path: 'debts', canActivate: [FeatureGuard], data: { featureKey: 'enable_debts', featureName: 'Sổ nợ' }, loadComponent: () => import('@features/debts/debts.component').then(m => m.DebtsComponent) },
  { path: 'staffs', canActivate: [FeatureGuard], data: { featureKey: 'enable_staffs', featureName: 'Nhân viên' }, loadComponent: () => import('@features/staffs/staffs.component').then(m => m.StaffsComponent) },
  { path: 'shifts', canActivate: [FeatureGuard], data: { featureKey: 'enable_shifts', featureName: 'Ca làm việc' }, loadComponent: () => import('@features/shifts/shifts.component').then(m => m.ShiftsComponent) },
  { path: 'mobile-sign', loadComponent: () => import('@features/auth/pages/mobile-sign/mobile-sign.component').then(m => m.MobileSignComponent) },
  { path: 'blockchain-explorer', loadComponent: () => import('@features/blockchain/pages/blockchain-explorer/blockchain-explorer.component').then(m => m.BlockchainExplorerComponent) },
  { path: 'claim-points', loadComponent: () => import('@features/claim-points/claim-points.component').then(m => m.ClaimPointsComponent) },
  { path: 'marketplace', loadComponent: () => import('@features/marketplace/marketplace.component').then(m => m.MarketplaceComponent) },
  { path: 'store/:slug', loadComponent: () => import('@features/storefront/pages/store/store.component').then(m => m.StoreComponent) },
  { path: 'admin', loadComponent: () => import('@features/admin/admin-saas.component').then(m => m.AdminSaaSComponent) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];


