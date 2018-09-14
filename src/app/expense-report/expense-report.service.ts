import * as SZ from '../globalConstants';
import { Injectable } from '../../../node_modules/@angular/core';
import { ExpenseReport } from './expense-report.model';
import { AngularFirestoreCollection, AngularFirestore } from '../../../node_modules/angularfire2/firestore';
import { Observable } from '../../../node_modules/rxjs';
import { map } from '../../../node_modules/rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { FundingRequestService } from '../funding-request/funding-request.service';

@Injectable()
export class ExpenseReportService {
    private localErList: ExpenseReport[] = [];
    private erCollectionRef: AngularFirestoreCollection<ExpenseReport>;

    constructor(private authService: AuthService,
        private frService: FundingRequestService,
        private db: AngularFirestore) {
        this.erCollectionRef = this.db.collection('expenseReports', ref => ref.where('isDeleted', '==', false));
        this.erCollectionRef.snapshotChanges().subscribe(
            frList => {
                this.localErList = frList.map(ExpenseReport.getErFromSnapshot);
            }
        );
    }

    getListRestrictions() {
        const me = this;
        const user = this.authService.loggedUserInstance;
        if (user) {
            if (me.authService.CanManageAllFrEr() || user.leadOf.length) {
                return ref => ref.where('isDeleted', '==', false);
            } else {
                return ref => ref
                    .where('isDeleted', '==', false)
                    .where('createUserId', '==', me.authService.loggedUserId);
            }
        }
    }

    getErList(): Observable<ExpenseReport[]> {
        const me = this;
        const user = this.authService.loggedUserInstance;
        if (user) {
            return me.db.collection('expenseReports', me.getListRestrictions()).snapshotChanges().pipe(
                map(erList => erList.map(ExpenseReport.getErFromSnapshot)),
                map(erList => {
                    const filteredList = erList.filter(
                        er => {
                            if (me.authService.CanManageAllFrEr()) {
                                return true;
                            }
                            if (user.leadOf.length) {
                                return user.id === er.createUserId ||
                                    (user.leadOf.indexOf(er.projectId) !== -1
                                        && er.isSent);
                            }
                            return true;
                        }
                    );
                    return filteredList;
                })
            );
        }
    }

    getEr(erId: string): Observable<ExpenseReport> {
        const erRef = this.db.doc('expenseReports/' + erId);
        if (erRef) {
            return erRef.valueChanges().pipe(
                map(er => {
                    if (er) {
                        return ExpenseReport.getErFromValue(erId, er);
                    }
                })
            );
        } else {
            console.warn('Not able to get expense report ' + erId + ' from db');
        }
    }

    addEr(erData) {
        erData.isDeleted = false;
        erData.isSent = false;
        erData.state = SZ.CREATED;
        erData.date = erData.date.getTime();
        erData.activity = [{
            action: SZ.CREATED,
            userId: erData.createUserId,
            date: erData.date
        }];
        this.erCollectionRef.add(erData)
            .then(
                (newErRef) => {
                    this.frService.updateFr(erData.frId, { erId: newErRef.id });
                }
            );
    }

    updateEr(erId, erData) {
        const erRef = this.db.doc('expenseReports/' + erId);
        if (erRef) {
            if (erData.date) {
                erData.date = erData.date.getTime();
            }
            erRef.update(erData);
        } else {
            console.log('Cannot update expense report, not able to get expense report ' + erId);
        }
    }

    sendEr(erId: string, erActivity) {
        const me = this;
        me.updateEr(erId, {
            isSent: true,
            state: SZ.SENT,
            activity: erActivity
        });
    }

    verifyEr(erId: string, erActivity) {
        const me = this;
        me.updateEr(erId, {
            state: SZ.VERIFIED,
            activity: erActivity
        });
    }

    approveEr(erId: string, erActivity) {
        const me = this;
        me.updateEr(erId, {
            state: SZ.APPROVED,
            approveUserId: me.authService.getLoggedUserId(),
            activity: erActivity
        });
    }

    rejectEr(erId: string, erActivity) {
        const me = this;
        me.updateEr(erId, {
            state: SZ.REJECTED,
            isSent: false,
            activity: erActivity
        });
    }

    deleteEr(erId: string) {
        const erRef = this.db.doc('expenseReports/' + erId);
        if (erRef) {
            erRef.delete();
        } else {
            console.log('Cannot delete expense report, not able to get expense report ' + erId);
        }
        // this.updateEr(erId, { isDeleted: true });
    }

    generateErCode(frCode: string): string {
        if (frCode) {
            const codeNumber = frCode.split('-')[1];
            return 'DES-' + codeNumber;
        }
        return '';
    }
}
