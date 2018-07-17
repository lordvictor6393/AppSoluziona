import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../user.model';
import { UsersService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatSort, MatTable } from '../../../../node_modules/@angular/material';

@Component({
  selector: 'app-u-list',
  templateUrl: './u-list.component.html',
  styleUrls: ['./u-list.component.css']
})
export class UListComponent implements OnInit {

  users: User[];
  uListColumns: string[];
  usersDataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) userTable: MatTable<User>;

  constructor(private userService: UsersService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.uListColumns = [
      'name',
      'phone',
      'ci',
      'mail',
      'editBtn'
    ]
    this.userService.getUserList().subscribe(
      usersList => {
        this.users = usersList;
        this.usersDataSource.data = this.users;
      }
    );
    this.usersDataSource.sort = this.sort;
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

  onDeleteUser(userId: string) {
    this.userService.deleteUser(userId);
  }
}
