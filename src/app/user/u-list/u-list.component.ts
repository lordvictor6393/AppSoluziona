import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { UsersService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-u-list',
  templateUrl: './u-list.component.html',
  styleUrls: ['./u-list.component.css']
})
export class UListComponent implements OnInit {

  users: User[];

  constructor(private userService: UsersService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.userService.getUserList()
      .subscribe(
        usersList => {
          this.users = usersList;
        }
      )
  }

  onEditUser(userId: string) {
    this.router.navigate([userId], {
      relativeTo: this.route
    });
  }

  onAddUser() {
    this.router.navigate(['create'], {
      relativeTo: this.route
    });
  }

}
