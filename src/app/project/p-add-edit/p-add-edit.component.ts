import { Component, OnInit } from '@angular/core';
import { FormGroup } from '../../../../node_modules/@angular/forms';
import { User } from '../../user/user.model';
import { UsersService } from '../../user/user.service';

@Component({
  selector: 'app-p-add-edit',
  templateUrl: './p-add-edit.component.html',
  styleUrls: ['./p-add-edit.component.css']
})
export class PAddEditComponent implements OnInit {

  users: User[];
  projectForm: FormGroup;

  memberGridColumns: string[];
  addMemberMode: boolean = false;
  projectMembers: User[];

  constructor(private userService: UsersService) { }

  ngOnInit() {
    this.projectForm = new FormGroup({});
    this.userService.getUserList().subscribe(
      userList => this.users = userList
    );

    this.memberGridColumns = ['name', 'ci', 'phone', 'mail', 'removeBtn'];
  }

}
