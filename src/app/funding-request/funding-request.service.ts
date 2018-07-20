import { FundingRequest } from "./funding-request.model";
import { AngularFirestore, AngularFirestoreCollection } from "../../../node_modules/angularfire2/firestore";
import { Observable } from "../../../node_modules/rxjs";
import { map } from "../../../node_modules/rxjs/operators";
import { Injectable } from "../../../node_modules/@angular/core";

@Injectable()
export class FundingRequestService {
    private localFrList: FundingRequest[] = [];
    private frCollectionRef: AngularFirestoreCollection<FundingRequest>;

    constructor(private db: AngularFirestore) {
        this.frCollectionRef = this.db.collection('fundingRequests', ref => ref.where('isDeleted', '==', false));
        this.frCollectionRef.snapshotChanges().subscribe(
            frList => {
                this.localFrList = frList.map(FundingRequest.getFrFromSnapshot);
            }
        );
    }

    getFrList(): Observable<FundingRequest[]> {
        return this.frCollectionRef.snapshotChanges().pipe(
            map( frList => frList.map(FundingRequest.getFrFromSnapshot) )
        );
    }

    getFr(frId: string): Observable<FundingRequest> {
        let frRef = this.db.doc('fundingRequests/' + frId);
        if(frRef) {
            return frRef.valueChanges().pipe(
                map(fr => {
                    if(fr) {
                        return FundingRequest.getFrFromValue(frId, fr);
                    }
                })
            );
        } else {
            console.error('Not able to get funding request ' + frId + ' from db');
        }
    }

    addFr(frData) {
        frData.isDeleted = false;
        frData.isSent = false;
        frData.state = 'Creado';
        frData.date = frData.date.getTime();
        this.frCollectionRef.add(frData);
    }

    updateFr(frId, frData) {
        let frRef = this.db.doc('fundingRequests/' + frId);
        if(frRef) {
            frData.date = frData.date.getTime();
            frRef.update(frData);
        } else {
            console.log('Cannot update funding request, not able to get funding request ' + frId);
        }
    }

    deleteFr(frId: string) {
        this.updateFr(frId, { isDeleted: true });
    }

    generateFrCode(): string {
        return 'SOL-' + (this.localFrList.length + 1);
    }
}