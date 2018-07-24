import * as SZ from '../globalConstants';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, of as ObservableOf } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { User } from '../user/user.model';
import { FundingRequest } from '../funding-request/funding-request.model';
import { ExpenseReport } from '../expense-report/expense-report.model';

@Injectable()
export class AuthService {

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
      SZ.COMMON, 
      SZ.ACCOUNTANT,
      SZ.CHIEF
    ];
    return this.checkAuthorization(allowed);
  }

  CanManageAllFrEr() {
    const allowed = [
      SZ.ACCOUNTANT,
      SZ.CHIEF
    ];
    return this.checkAuthorization(allowed);
  }

  CanReadProjects() {
    const allowed = [
      SZ.ACCOUNTANT,
      SZ.CHIEF
    ];
    return this.checkAuthorization(allowed);
  }
  
  CanManageProjects() {
    const allowed = [SZ.CHIEF];
    return this.checkAuthorization(allowed);
  }

  CanManageClients() {
    const allowed = [SZ.CHIEF];
    return this.checkAuthorization(allowed);
  }

  CanManageUsers() {
    const allowed = [SZ.CHIEF];
    return this.checkAuthorization(allowed);
  }

  CanAccessReports() {
    const allowed = [
      SZ.ACCOUNTANT,
      SZ.CHIEF
    ];
    return this.checkAuthorization(allowed);
  }

  CanApproveFr(fr: FundingRequest) {
    if(this.loggedUserInstance) {
      let userIsAdmin = this.CanManageAllFrEr();
      let userIsLead = this.loggedUserInstance.leadOf.indexOf(fr.projectId) !== -1;

      return (userIsLead && fr.state == SZ.SENT) || (userIsAdmin && (fr.state == SZ.SENT || fr.state == SZ.VERIFIED));
    }
    return false;
  }

  CanApproveEr(er: ExpenseReport) {
    if(this.loggedUserInstance) {
      let userIsAdmin = this.CanManageAllFrEr();
      let userIsLead = this.loggedUserInstance.leadOf.indexOf(er.projectId) !== -1;

      return (userIsLead && er.state == SZ.SENT) || (userIsAdmin && (er.state == SZ.SENT || er.state == SZ.VERIFIED));
    }
    return false;
  }
}
