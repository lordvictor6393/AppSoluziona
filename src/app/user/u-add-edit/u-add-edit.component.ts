import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from '../user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../user.service';

@Component({
  selector: 'app-u-add-edit',
  templateUrl: './u-add-edit.component.html',
  styleUrls: ['./u-add-edit.component.css']
})
export class UAddEditComponent implements OnInit {

  isNew: boolean = false;
  userForm: FormGroup;
  selectedUser: User;
  selectedUserId: string;
  @ViewChild('userPassword') userPassword: ElementRef;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService) { }

  ngOnInit() {

    this.userForm = new FormGroup({
      'name': new FormControl(null),
      'lastName': new FormControl(null),
      'ci': new FormControl(null),
      'ciPlace': new FormControl(null),
      'displayName': new FormControl(null),
      'mail': new FormControl(null),
      'phone': new FormControl(null),
      'position': new FormControl(null)
    });

    this.route.params.subscribe(
      params => {
        this.selectedUserId = params.id;
        if (this.selectedUserId) {
          this.loadUser();
        } else {
          this.isNew = true;
        }
      }
    );
  }

  loadUser() {
    this.userService.getUser(this.selectedUserId).subscribe(
      user => {
        this.selectedUser = user;
        this.userForm.setValue({
          name: user.name,
          lastName: user.lastName,
          ci: user.ci,
          ciPlace: user.ciPlace,
          mail: user.mail,
          phone: user.phone,
          displayName: user.displayName,
          position: user.position
        });
      }
    )
  }

  onUserSubmit() {
    let formValues = this.userForm.value;
    let password = this.userPassword.nativeElement.value;
    if (this.isNew) {
      this.userService.addUser(formValues, password);
    } else {
      this.userService.updateUser(this.selectedUserId, formValues);
    }
    this.userForm.reset();
    this.backToList();
  }

  backToList() {
    this.router.navigate(['/users']);
  }
}
