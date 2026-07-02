import { Component, inject, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppBarComponent } from '@shared/components/app-bar/app-bar.component';
import { SideNavigationComponent } from './shared/components/side-navigation/side-navigation.component';
import { AuthenticationApiFacade } from './features/authentication/state/authentication-api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppBarComponent, SideNavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private authenticationApiFacade = inject(AuthenticationApiFacade);
  isAuthenticated: Signal<boolean> = this.authenticationApiFacade.isAuthenticated;
}
