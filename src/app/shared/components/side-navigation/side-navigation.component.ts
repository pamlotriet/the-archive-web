import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationItem } from '@app/shared/types/side-navigation.types';
import { AuthenticationApiFacade } from '@features/authentication/state/authentication-api';

@Component({
  selector: 'app-side-navigation',
  imports: [RouterLink, RouterLinkActive, PIcon, TranslatePipe],
  templateUrl: './side-navigation.component.html',
  styleUrl: './side-navigation.component.css',
})
export class SideNavigationComponent {
  private readonly authenticationFacade = inject(AuthenticationApiFacade);

  protected readonly user = this.authenticationFacade.user;
  protected readonly userName = computed(() => {
    const user = this.user();

    return (
      [user?.name, user?.lastname].filter(Boolean).join(' ') ||
      user?.displayName ||
      user?.email ||
      ''
    );
  });
  protected readonly userInitials = computed(() =>
    this.userName()
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join(''),
  );

  readonly navigationItems: NavigationItem[] = [
    {
      labelKey: 'navigation.items.dashboard',
      route: '/dashboard',
      icon: 'home',
      action: () => {},
    },
    {
      labelKey: 'navigation.items.library',
      route: '/library',
      icon: 'book',
      action: () => {},
    },
    {
      labelKey: 'navigation.items.collections',
      route: '/collections',
      icon: 'folder',
      action: () => {},
    },
    {
      labelKey: 'navigation.items.quotes',
      route: '/quotes',
      icon: 'comment',
      action: () => {},
    },
    {
      labelKey: 'navigation.items.notes',
      route: '/notes',
      icon: 'file-edit',
      action: () => {},
    },
    {
      labelKey: 'navigation.items.stats',
      route: '/stats',
      icon: 'chart-bar',
      action: () => {},
    },
    {
      labelKey: 'navigation.items.tags',
      route: '/tags',
      icon: 'tags',
      action: () => {},
    },
    {
      labelKey: 'navigation.items.settings',
      route: '/settings',
      icon: 'cog',
      action: () => {},
    },
  ];

  protected logout(): void {
    this.authenticationFacade.logout();
  }
}
