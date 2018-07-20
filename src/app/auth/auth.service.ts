import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, of as ObservableOf } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { User } from '../user/user.model';

@Injectable()
export class AuthService {

  loggedUserId: string;
  user: Observable<User>;
  userPassword: string;
  
  constructor(private afAuth: AngularFireAuth,
              private db: AngularFirestore,
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
          return this.db.doc('users/' + user.uid).valueChanges().pipe(
            map(userData => User.getUserFromValue(user.uid, userData))
          );
        } else {
          this.loggedUserId = '';
          return ObservableOf(null)
        }
      })
    );
  } 

  signinUser(email: string, password: string) {
    this.userPassword = password;
    return this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(email, password);
  }

  signOutUser() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }
}
