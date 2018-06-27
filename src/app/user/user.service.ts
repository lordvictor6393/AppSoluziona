import { Injectable } from "@angular/core";
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from "angularfire2/firestore";
import { User } from "./user.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AngularFireAuth } from "angularfire2/auth";

@Injectable()
export class UsersService {
    private userRef: AngularFirestoreDocument;
    private userCollectionRef: AngularFirestoreCollection<User>;

    constructor(private db: AngularFirestore,
                private afAuth: AngularFireAuth) {
        this.userCollectionRef = this.db.collection('users');
    }

    getUserList(): Observable<User[]> {
        return this.userCollectionRef.snapshotChanges().pipe(
            map(userList => userList.map(User.getUserFromSnapshot))
        );
    }

    getUser(userId: string): Observable<User> {
        this.userRef = this.db.doc('users/' + userId);
        return this.userRef.valueChanges().pipe(
            map(user => {
                if(user) {
                    return User.getUserFromValue(userId, user);
                }
            })
        );
    }

    addUser(userData, password) {
        let userId = '';
        this.afAuth.auth.createUserWithEmailAndPassword(userData.mail, password)
            .then(
                response => {
                    userId = response.user.uid;
                    this.userCollectionRef.doc(userId).set(userData);
                }
            )
    }

    updateUser(userData) {
        this.userRef.update(userData);
    }
}