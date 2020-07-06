import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/cms/services/toaster.service'
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {

  public login: FormGroup;
  static submitLoader = false;

  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToasterService,
    public router: Router,
    public authService: AuthService,
  ) {
    AuthSigninComponent.submitLoader = false;
  }

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['public']);
    }
    this.login = this.formBuilder.group({
      email: ['',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: ['',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ]
    });
  }

  async onSubmit() {
    try {
      AuthSigninComponent.submitLoader = true;
      this.authService.signIn(this.login.value);
    } catch (e) {
      this.toaster.addToast({ title: 'Error', msg: e.message, type: 'error' });
      AuthSigninComponent.submitLoader = false;
    }
  }

  get staticSubmitLoader() {
    return AuthSigninComponent.submitLoader;
  }

}