import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, of as ObservableOf } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { UsersService } from '../user/user.service';

interface User {
  uid: string,
  email: string,
  displayName?: string,
  position?: string
}

@Injectable()
export class AuthService {

  loggedUserId: string;
  user: Observable<User>;
  
  constructor(private afAuth: AngularFireAuth,
              private db: AngularFirestore,
              private usersService: UsersService,
              private router: Router) { 
    this.setLoggedUser();
  }

  getLoggedUserId() {
    return this.loggedUserId;
  }

  setLoggedUser() {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if(user) {
          this.loggedUserId = user.uid;
          return this.usersService.getUser(user.uid);
        } else {
          this.loggedUserId = '';
          return ObservableOf(null)
        }
      })
    );
  } 

  signinUser(email: string, password: string) {
    return this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(email, password);
  }

  signOutUser() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }
}
