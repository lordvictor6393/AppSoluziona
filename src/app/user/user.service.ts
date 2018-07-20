import { Injectable } from "@angular/core";
import { AngularFirestoreCollection, AngularFirestore } from "angularfire2/firestore";
import { User } from "./user.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AngularFireAuth } from "angularfire2/auth";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class UsersService {
    private localUserList: User[] = [];
    private userCollectionRef: AngularFirestoreCollection<User>;

    constructor(private db: AngularFirestore,
        private afAuth: AngularFireAuth,
        private authService?: AuthService) {
        this.userCollectionRef = this.db.collection('users', ref => ref.where('isDeleted', '==', false));
        this.userCollectionRef.snapshotChanges().subscribe(
            userList => {
                this.localUserList = userList.map(User.getUserFromSnapshot);
            }
        );
    }

    getUserList(): Observable<User[]> {
        return this.userCollectionRef.snapshotChanges().pipe(
            map(userList => userList.map(User.getUserFromSnapshot))
        );
    }

    getUser(userId: string): Observable<User> {
        let userRef = this.db.doc('users/' + userId);
        if (userRef) {
            return userRef.valueChanges().pipe(
                map(user => {
                    if (user) {
                        return User.getUserFromValue(userId, user);
                    }
                })
            );
        } else {
            console.error('Not able to get user ' + userId + ' from db');
        }
    }

    addUser(userData, password) {
        let userId = '';
        userData.isDeleted = false;
        let userMail = this.afAuth.auth.currentUser.email;
        let userPass = this.authService.userPassword;

        this.afAuth.auth.createUserWithEmailAndPassword(userData.mail, password)
            .then(
                response => {
                    userId = response.user.uid;
                    this.userCollectionRef.doc(userId).set(userData).then(
                        response => {
                            this.afAuth.auth.signOut();
                            this.authService.signinUser(userMail, userPass);
                        }
                    );
                }
            )
    }

    updateUser(userId: string, userData) {
        let userRef = this.db.doc('users/' + userId);
        if (userRef) {
            userRef.update(userData);
        } else {
            console.error('Cannot update user, not able to get user ' + userId);
        }
    }

    deleteUser(userId: string) {
        this.updateUser(userId, { isDeleted: true });
    }

    registerProject(userId: string, projId: string) {
        let userRef = this.db.doc('users/' + userId);
        let userInstance: User;
        let userProjects: string[];
        if (userRef) {
            userInstance = this.localUserList.find(user => user.id == userId);
            if (userInstance) {
                userProjects = userInstance.projectIds;
                if (userProjects.indexOf(projId) == -1) {
                    userProjects.push(projId);
                    userRef.update({ projectIds: userProjects });
                    console.log('project registered successfully');
                } else {
                    console.log('project already registered');
                }
            } else {
                console.error('Not able to find user in local users list');
            }
        } else {
            console.error('Cannot register project, not able to get user ' + userId);
        }
    }

    unregisterProject(userId: string, projId: string) {
        let userRef = this.db.doc('users/' + userId);
        let idx: number;
        let userInstance: User;
        let userProjects: string[];
        if (userRef) {
            userInstance = this.localUserList.find(user => user.id == userId);
            if (userInstance) {
                userProjects = userInstance.projectIds;
                idx = userProjects.indexOf(projId);
                if (idx !== -1) {
                    userProjects.splice(idx, 1);
                    userRef.update({ projectIds: userProjects });
                    console.log('project registered successfully');
                } else {
                    console.log('project already registered');
                }
            } else {
                console.error('Not able to find user in local users list');
            }
        } else {
            console.error('Cannot register project, not able to get user ' + userId);
        }
    }

    getCompleteUserName(userId: string) {
        if (this.localUserList.length) {
            let userInstance = this.localUserList.find(user => user.id == userId);
            if (userInstance) {
                return userInstance.name + ' ' + userInstance.lastName;
            } else {
                console.error('Not able to find user in local users list');
            }
        } else return '';
    }
}