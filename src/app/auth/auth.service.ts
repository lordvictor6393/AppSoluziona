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
        if (user) {
          this.loggedUserId = user.uid;
          const user$ = this.db.doc('users/' + user.uid).valueChanges().pipe(
            map(userData => User.getUserFromValue(user.uid, userData))
          );
          user$.subscribe(userInstance => this.loggedUserInstance = userInstance);
          return user$;
        } else {
          this.loggedUserId = '';
          return ObservableOf(null);
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
    if (!this.loggedUserInstance) {
      return false;
    }
    for (const role of allowedRoles) {
      if (this.loggedUserInstance.roles[role]) {
        return true;
      }
    }
    return false;
  }

  CanEditProfile(): boolean {
    const allowed = [
      SZ.COMMON,
      SZ.ACCOUNTANT,
      SZ.CHIEF,
      SZ.SUPERADMIN
    ];
    return this.checkAuthorization(allowed);
  }

  CanManageAllFrEr() {
    const allowed = [
      SZ.ACCOUNTANT,
      SZ.CHIEF,
      SZ.SUPERADMIN
    ];
    return this.checkAuthorization(allowed);
  }

  CanReadProjects() {
    const allowed = [
      SZ.ACCOUNTANT,
      SZ.CHIEF,
      SZ.SUPERADMIN
    ];
    return this.checkAuthorization(allowed);
  }

  CanManageProjects() {
    const allowed = [
      SZ.CHIEF,
      SZ.SUPERADMIN];
    return this.checkAuthorization(allowed);
  }

  CanManageClients() {
    const allowed = [
      SZ.CHIEF,
      SZ.SUPERADMIN];
    return this.checkAuthorization(allowed);
  }

  CanManageUsers() {
    const allowed = [SZ.SUPERADMIN];
    return this.checkAuthorization(allowed);
  }

  CanManageSettings() {
    const allowed = [SZ.SUPERADMIN];
    return this.checkAuthorization(allowed);
  }

  CanAccessReports() {
    const allowed = [
      SZ.SUPERADMIN
    ];
    return this.checkAuthorization(allowed);
  }

  CanVerifyFr(fr: FundingRequest) {
    if (this.loggedUserInstance && fr) {
      const userIsAdmin = this.CanManageAllFrEr();
      const userIsLead = this.loggedUserInstance.leadOf.indexOf(fr.projectId) !== -1;

      return fr.state === SZ.SENT && (userIsAdmin || userIsLead);
    }
    return false;
  }

  CanApproveFr(fr: FundingRequest) {
    if (this.loggedUserInstance && fr) {
      const userIsAdmin = this.CanManageAllFrEr();
      return (userIsAdmin && fr.state === SZ.VERIFIED);
    }
    return false;
  }

  CanVerifyEr(er: ExpenseReport) {
    if (this.loggedUserInstance && er) {
      const userIsAdmin = this.CanManageAllFrEr();
      const userIsLead = this.loggedUserInstance.leadOf.indexOf(er.projectId) !== -1;

      return er.state === SZ.SENT && (userIsAdmin || userIsLead);
    }
    return false;
  }

  CanApproveEr(er: ExpenseReport) {
    if (this.loggedUserInstance && er) {
      const userIsAdmin = this.CanManageAllFrEr();
      return (userIsAdmin && er.state === SZ.VERIFIED);
    }
    return false;
  }
}
