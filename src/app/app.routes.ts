import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'authentication' },
  {
    path: 'authentication',
    loadComponent: () =>
      import('@features/authentication/pages/authentication/authentication.component').then(
        (m) => m.AuthenticationComponent,
      ),
  },
  { path: 'login', pathMatch: 'full', redirectTo: 'authentication' },
  {
    path: 'register',
    loadComponent: () =>
      import('@features/authentication/pages/authentication/authentication.component').then(
        (m) => m.AuthenticationComponent,
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('@features/dashboard/pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'collections',
    loadComponent: () =>
      import('@features/collections/pages/collections/collections.component').then(
        (m) => m.CollectionsComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'library',
    loadComponent: () =>
      import('@features/library/pages/library/library.component').then((m) => m.LibraryComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'notes',
    loadComponent: () =>
      import('@features/notes/pages/notes/notes.component').then((m) => m.NotesComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'quotes',
    loadComponent: () =>
      import('@features/quotes/pages/quotes/quotes.component').then((m) => m.QuotesComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('@features/settings/pages/settings/settings.component').then(
        (m) => m.SettingsComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'tags',
    loadComponent: () =>
      import('@features/tags/pages/tags/tags.component').then((m) => m.TagsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'stats',
    loadComponent: () =>
      import('@features/stats/pages/stats/stats.component').then((m) => m.StatsComponent),
    canActivate: [AuthGuard],
  },
];
