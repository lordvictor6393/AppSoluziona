import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UsersService } from '../../user/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;

  constructor(private authService: AuthService,
              private router: Router,
              private usersService: UsersService) { }

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
          this.authService.setLoggedUser();
          this.router.navigate(['/fundingRequests']);
        }
      ).catch(
        response => {
          console.log('login failed', response);
        }
      );
  }
}
