import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'authentication' },
  {
    path: 'authentication',
    loadComponent: () =>
      import(
        '@features/authentication/pages/authentication/authentication.component'
      ).then((m) => m.AuthenticationComponent),
  },
  { path: 'login', pathMatch: 'full', redirectTo: 'authentication' },
  {
    path: 'register',
    loadComponent: () =>
      import(
        '@features/authentication/pages/authentication/authentication.component'
      ).then((m) => m.AuthenticationComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('@features/dashboard/pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    canActivate: [AuthGuard],
  },
];
