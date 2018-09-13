import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './../shared/services/auth.service';
import { MaterialService } from './../shared/classes/material.service';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  aSub: Subscription;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
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

    this.aSub = this.auth.register(user).subscribe(
      () => {
        this.router.navigate(['/login'], {
          queryParams: {
            registered: true
          }
        });
      },
      err => {
        MaterialService.toast(err.error.message, 'red');
        console.log('Error', err);
        this.form.enable();
      }
    );
  }
}
