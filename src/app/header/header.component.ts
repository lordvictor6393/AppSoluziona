import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedUserName: string;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.user.subscribe(
      user => {
        if(user) this.loggedUserName = user.name + ' ' + user.lastName;
      }
    );
  }

  onUserLogOut() {
    this.authService.signOutUser();
  }

}
