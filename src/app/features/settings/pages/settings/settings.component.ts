import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';
import { AuthenticationApiFacade } from '@features/authentication/state/authentication-api';
import { TranslatePipe } from '@ngx-translate/core';
import { PIcon } from '@primeicons/angular/p-icon';

type AccentOption = {
  id: string;
  label: string;
  color: string;
  foreground: string;
};

@Component({
  selector: 'app-settings',
  host: {
    class: 'block min-w-0 w-full',
  },
  imports: [PageHeaderComponent, TranslatePipe, PIcon],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly authenticationApiFacade = inject(AuthenticationApiFacade);

  protected readonly user = this.authenticationApiFacade.user;
  protected readonly isDark = signal(false);
  protected readonly compactMode = signal(false);
  protected readonly emailNotifications = signal(true);
  protected readonly readingReminders = signal(false);
  protected readonly privateLibrary = signal(true);
  protected readonly selectedAccent = signal('gold');

  protected readonly accentOptions: AccentOption[] = [
    { id: 'gold', label: 'Gold', color: 'oklch(0.78 0.13 82)', foreground: 'oklch(0.18 0.04 265)' },
    { id: 'emerald', label: 'Emerald', color: 'oklch(0.72 0.14 155)', foreground: 'oklch(0.14 0.04 165)' },
    { id: 'rose', label: 'Rose', color: 'oklch(0.72 0.18 15)', foreground: 'oklch(0.16 0.04 15)' },
    { id: 'cyan', label: 'Cyan', color: 'oklch(0.74 0.14 220)', foreground: 'oklch(0.14 0.04 240)' },
    { id: 'violet', label: 'Violet', color: 'oklch(0.72 0.16 295)', foreground: 'oklch(0.16 0.04 295)' },
  ];

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isDark.set((localStorage.getItem('theme') ?? 'dark') === 'dark');
    localStorage.removeItem('fontScale');
    this.compactMode.set(localStorage.getItem('compactMode') === 'true');
    this.emailNotifications.set(localStorage.getItem('emailNotifications') !== 'false');
    this.readingReminders.set(localStorage.getItem('readingReminders') === 'true');
    this.privateLibrary.set(localStorage.getItem('privateLibrary') !== 'false');
    this.selectedAccent.set(localStorage.getItem('accentColor') || 'gold');
    this.applyPreferences();
  }

  protected userName(): string {
    const user = this.user();
    const fullName = [user?.name, user?.lastname].filter(Boolean).join(' ');

    return fullName || user?.displayName || 'Archive keeper';
  }

  protected userEmail(): string {
    return this.user()?.email ?? 'No email available';
  }

  protected userInitials(): string {
    return this.userName()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join('');
  }

  protected toggleDarkMode(): void {
    this.isDark.update((value) => !value);
    this.persistPreference('theme', this.isDark() ? 'dark' : 'light');
    this.applyPreferences();
  }

  protected selectAccent(accentId: string): void {
    this.selectedAccent.set(accentId);
    this.persistPreference('accentColor', accentId);
    this.applyPreferences();
  }

  protected toggleCompactMode(): void {
    this.compactMode.update((value) => !value);
    this.persistPreference('compactMode', String(this.compactMode()));
    this.applyPreferences();
  }

  protected toggleEmailNotifications(): void {
    this.emailNotifications.update((value) => !value);
    this.persistPreference('emailNotifications', String(this.emailNotifications()));
  }

  protected toggleReadingReminders(): void {
    this.readingReminders.update((value) => !value);
    this.persistPreference('readingReminders', String(this.readingReminders()));
  }

  protected togglePrivateLibrary(): void {
    this.privateLibrary.update((value) => !value);
    this.persistPreference('privateLibrary', String(this.privateLibrary()));
  }

  protected resetPreferences(): void {
    this.isDark.set(true);
    this.compactMode.set(false);
    this.emailNotifications.set(true);
    this.readingReminders.set(false);
    this.privateLibrary.set(true);
    this.selectedAccent.set('gold');

    if (isPlatformBrowser(this.platformId)) {
      ['theme', 'fontScale', 'compactMode', 'emailNotifications', 'readingReminders', 'privateLibrary', 'accentColor'].forEach(
        (key) => localStorage.removeItem(key),
      );
    }

    this.applyPreferences();
  }

  protected logout(): void {
    this.authenticationApiFacade.logout();
  }

  private selectedAccentOption(): AccentOption {
    return (
      this.accentOptions.find((accentOption) => accentOption.id === this.selectedAccent()) ??
      this.accentOptions[0]
    );
  }

  private applyPreferences(): void {
    const root = this.document.documentElement;
    const accent = this.selectedAccentOption();

    root.classList.toggle('dark', this.isDark());
    root.classList.toggle('compact', this.compactMode());
    root.style.removeProperty('--font-scale');
    root.style.setProperty('--accent', accent.color);
    root.style.setProperty('--gold', accent.color);
    root.style.setProperty('--ring', accent.color);
    root.style.setProperty('--accent-foreground', accent.foreground);
    root.style.setProperty('--gold-foreground', accent.foreground);
  }

  private persistPreference(key: string, value: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(key, value);
  }
}
