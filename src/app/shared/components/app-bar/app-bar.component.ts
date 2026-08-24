import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Moon } from '@primeicons/angular/moon';
import { Sun } from '@primeicons/angular/sun';

@Component({
  selector: 'app-app-bar',
  imports: [TranslatePipe, Moon, Sun],
  templateUrl: './app-bar.component.html',
})
export class AppBarComponent {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly isDark = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      this.applyTheme(storedTheme ? storedTheme === 'dark' : prefersDark);
    }
  }

  protected toggleTheme(): void {
    const dark = !this.isDark();
    this.applyTheme(dark);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    }
  }

  private applyTheme(dark: boolean): void {
    this.isDark.set(dark);
    this.document.documentElement.classList.toggle('dark', dark);
  }
}
