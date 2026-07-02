import { FormControl, FormGroup } from '@angular/forms';

export type AuthenticationForm = FormGroup<{
  name: FormControl<string>;
  lastname: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}>;
