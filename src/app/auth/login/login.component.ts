import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/auth.service';

import { LoginForm } from '../../interfaces/login_form.inteface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public form: FormGroup;
  public loginForm: LoginForm;
  public formSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[_A-Za-z0-9-\\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
          ),
        ],
      ],
    });
  }

  async saveForm(): Promise<void> {
    this.formSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loginForm = this.form.value;
    this.authService
      .loginUser(this.loginForm)
      .subscribe(
        (result: any) => {
          this.authService.saveToken(result.access_token);
          const now = new Date();
          now.setSeconds(7200);
          this.authService.setExpiresDate(now.getTime().toString());
          localStorage.setItem('id', result.id);
          localStorage.setItem('email', result.email);
          this.router.navigate(['/main']);
        },
        (err) => {
          Swal.fire('Error', err.error.error, 'error');
        }
      );
  }

  invalidInput(input: string): boolean {
    return this.form.get(input).invalid && this.form.get(input).touched;
  }

  invalidForm(): boolean {
    return this.form.invalid && this.formSubmitted;
  }
}