import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthService } from './../shared/services/auth.service';
import { MaterialService } from './../shared/classes/material.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  aSub: Subscription;

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('You are successfully registered! You can login in our application!', 'green');
      } else if (params['accessDenied']) {
        MaterialService.toast('You are not authorized! Please, first log in!', 'red');
      }
      // } else if (params['sessionFailed']) {
      //   MaterialService.toast('Please, log in again!', 'red');
      // }
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }    
  }

  onSubmit() {
    const user = {
      email: this.form.value.email,
      password: this.form.value.password
    }

    this.form.disable();

    this.aSub = this.auth.login(user).subscribe(
      () => {
        // console.log('Login success!');
        this.router.navigate(['/overview']);
      },
      err => {
        MaterialService.toast(err.error.message, 'red');
        // console.log('Error', err);
        this.form.enable();
      }
    );
  }

}
