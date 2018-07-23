import * as SZ from '../globalConstants';
import { Injectable } from "../../../node_modules/@angular/core";
import { ExpenseReport } from "./expense-report.model";
import { AngularFirestoreCollection, AngularFirestore } from "../../../node_modules/angularfire2/firestore";
import { Observable } from "../../../node_modules/rxjs";
import { map } from "../../../node_modules/rxjs/operators";

@Injectable()
export class ExpenseReportService {
    private localErList: ExpenseReport[] = [];
    private erCollectionRef: AngularFirestoreCollection<ExpenseReport>;

    constructor(private db: AngularFirestore) {
        this.erCollectionRef = this.db.collection('expenseReports', ref => ref.where('isDeleted', '==', false));
        this.erCollectionRef.snapshotChanges().subscribe(
            frList => {
                this.localErList = frList.map(ExpenseReport.getErFromSnapshot);
            }
        );
    }

    getErList(): Observable<ExpenseReport[]> {
        return this.erCollectionRef.snapshotChanges().pipe(
            map( frList => frList.map(ExpenseReport.getErFromSnapshot) )
        );
    }

    getEr(erId: string): Observable<ExpenseReport> {
        let erRef = this.db.doc('expenseReports/' + erId);
        if(erRef) {
            return erRef.valueChanges().pipe(
                map(er => {
                    if(er) {
                        return ExpenseReport.getErFromValue(erId, er);
                    }
                })
            );
        } else {
            console.error('Not able to get expense report ' + erId + ' from db');
        }
    }

    addEr(erData) {
        erData.isDeleted = false;
        erData.isSent = false;
        erData.state = SZ.CREATED;
        erData.date = erData.date.getTime();
        this.erCollectionRef.add(erData);
    }

    updateEr(erId, erData) {
        let erRef = this.db.doc('expenseReports/' + erId);
        if(erRef) {
            erData.date = erData.date.getTime();
            erRef.update(erData);
        } else {
            console.log('Cannot update expense report, not able to get expense report ' + erId);
        }
    }

    deleteEr(erId: string) {
        this.updateEr(erId, { isDeleted: true });
    }

    generateErCode(): string {
        return 'DES-' + (this.localErList.length + 1);
    }
}