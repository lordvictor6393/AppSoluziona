import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, of as ObservableOf } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { User } from '../user/user.model';

@Injectable()
export class AuthService {
  private rolesEnum = {
    COMMON: 'common',
    ACCOUNTANT: 'accountant',
    CHIEF: 'chief'
  }

  loggedUserId: string;
  user: Observable<User>;
  loggedUserInstance: User;
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
          let user$ = this.db.doc('users/' + user.uid).valueChanges().pipe(
            map(userData => User.getUserFromValue(user.uid, userData))
          );
          user$.subscribe( userInstance => this.loggedUserInstance = userInstance );
          return user$;
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

  private checkAuthorization(allowedRoles: string[]): boolean {
    if(!this.loggedUserInstance) return false;
    for (const role of allowedRoles) {
      if( this.loggedUserInstance.roles[role]) {
        return true;
      }
    }
    return false;
  }

  CanEditProfile(): boolean {
    const allowed = [
      this.rolesEnum.COMMON, 
      this.rolesEnum.ACCOUNTANT,
      this.rolesEnum.CHIEF
    ];
    return this.checkAuthorization(allowed);
  }

  CanManageOwnFrEr() {
    const allowed = [
      this.rolesEnum.COMMON, 
      this.rolesEnum.ACCOUNTANT,
      this.rolesEnum.CHIEF
    ];
    return this.checkAuthorization(allowed);
  }

  CanManageAllFrEr() {
    const allowed = [
      this.rolesEnum.ACCOUNTANT,
      this.rolesEnum.CHIEF
    ];
    return this.checkAuthorization(allowed);
  }

  CanManageProjects() {
    const allowed = [this.rolesEnum.CHIEF];
    return this.checkAuthorization(allowed);
  }

  CanManageClients() {
    const allowed = [this.rolesEnum.CHIEF];
    return this.checkAuthorization(allowed);
  }

  CanManageUsers() {
    const allowed = [this.rolesEnum.CHIEF];
    return this.checkAuthorization(allowed);
  }

  CanAccessReports() {
    const allowed = [
      this.rolesEnum.ACCOUNTANT,
      this.rolesEnum.CHIEF
    ];
    return this.checkAuthorization(allowed);
  }

  CanApproveFr(frId: string) {
    if(this.loggedUserInstance) {
      return this.loggedUserInstance.leadOf.indexOf(frId) !== -1;
    }
    return false;
  }
}
