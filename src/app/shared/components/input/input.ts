import { Component, input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-input',
  imports: [InputTextModule, FloatLabelModule,ReactiveFormsModule, FormsModule],
  templateUrl: './input.html',
  styleUrl: './input.css',
})
export class Input {
  control = input<FormControl>( new FormControl(''));
  floatLabel = input<string>('Enter text');
  errorMessage = input<string>('');
}
