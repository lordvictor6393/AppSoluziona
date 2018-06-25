import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';

interface User {
  uid: string,
  email: string,
  displayName?: string,
  position?: string
}

@Injectable()
export class AuthService {

  user: Observable<User>;
  constructor(private afAuth: AngularFireAuth,
              private db: AngularFirestore,
              private router: Router) { 
    // this.user = this.afAuth.authState;
  }

  signinUser(email: string, password: string) {
    return this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(email, password);
  }
}
