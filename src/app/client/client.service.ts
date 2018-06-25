import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { Client } from "./client.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

@Injectable()
export class ClientService {
    private clientRef: AngularFirestoreDocument;
    private clientsCollectionRef: AngularFirestoreCollection<Client>;

    constructor(private db: AngularFirestore) {
        this.clientsCollectionRef = this.db.collection('clients');
    }

    getClientList(): Observable<Client[]> {
        return this.clientsCollectionRef.snapshotChanges().pipe(
            map(clientsList => clientsList.map(Client.getClientFromSnapshot))
        );
    }
    getClient(clientId: string): Observable<Client> {
        this.clientRef = this.db.doc('clients/' + clientId);
        return this.clientRef.valueChanges().pipe(
            map(client => Client.getClientFromValue(clientId, client))
        );
    }
    addClient(clientData) {
        this.clientsCollectionRef.add(clientData);
    }
    updateClient(clientData) {
        this.clientRef.update(clientData);
    }
}