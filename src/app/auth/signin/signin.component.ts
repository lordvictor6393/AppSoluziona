import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.signinForm = new FormGroup({
      email: new FormControl(null),
      password: new FormControl(null)
    });
  }

  onUserSignin() {
    let formValues = this.signinForm.value;
    this.authService.signinUser(formValues.email, formValues.password)
      .then(
        (response) => {
          console.log(response);
          this.router.navigate(['']);
        }
      );
  }
}
