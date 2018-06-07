import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { Client } from "./client.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

@Injectable()
export class ClientService {
    private clients: AngularFirestoreCollection<Client>;

    constructor(private db: AngularFirestore) {}

    getClientList(): Observable<Client[]> {
        return this.db.collection('clients').snapshotChanges().pipe(
            map(clientsList => clientsList.map(Client.getClientFromSnapshot))
        );
    }
}