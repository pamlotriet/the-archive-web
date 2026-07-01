import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppBarComponent } from '@shared/components/app-bar/app-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('the-archive-web');
}
