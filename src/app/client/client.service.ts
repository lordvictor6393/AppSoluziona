import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Client } from './client.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class ClientService {
    private localClientList: Client[] = [];
    private clientsCollectionRef: AngularFirestoreCollection<Client>;

    constructor(private db: AngularFirestore) {
        this.clientsCollectionRef = this.db.collection('clients', ref => ref.where('isDeleted', '==', false));
        this.clientsCollectionRef.snapshotChanges().subscribe(
            clientList => {
                this.localClientList = clientList.map(Client.getClientFromSnapshot);
            }
        );
    }

    getClientList(): Observable<Client[]> {
        return this.clientsCollectionRef.snapshotChanges().pipe(
            map(clientList => clientList.map(Client.getClientFromSnapshot))
        );
    }

    getClient(clientId: string): Observable<Client> {
        if (clientId) {
            const clientRef = this.db.doc('clients/' + clientId);
            if (clientRef) {
                return clientRef.valueChanges().pipe(
                    map(client => {
                        if (client) {
                            return Client.getClientFromValue(clientId, client);
                        }
                    })
                );
            } else {
                console.warn('Not able to get client ' + clientId + ' from db');
            }
        }
    }

    addClient(clientData) {
        clientData.isDeleted = false;
        clientData.projectsIds = clientData.projectsIds || [];
        this.clientsCollectionRef.add(clientData);
    }

    updateClient(clientId: string, clientData) {
        if (clientId) {
            const clientRef = this.db.doc('clients/' + clientId);
            if (clientRef) {
                clientRef.update(clientData);
            } else {
                console.warn('Cannot update client, not able to get client ' + clientId);
            }
        }
    }

    deleteClient(clientId: string) {
        if (clientId) {
            const clientRef = this.db.doc('clients/' + clientId);
            if (clientRef) {
                clientRef.delete();
            } else {
                console.warn('Cannot remove client, not able to get client ' + clientId);
            }
            // this.updateClient(clientId, { isDeleted: true });
        }
    }

    getClientName(clientId: string) {
        if (clientId) {
            if (this.localClientList.length && clientId) {
                const clientInstance = this.localClientList.find(client => client.id === clientId);
                if (clientInstance) {
                    return clientInstance.name;
                } else {
                    console.warn('Not able to find client in local clients list');
                }
            } else {
                return '';
            }
        }
    }

    registerProject(clientId, projId) {
        if (clientId && projId) {
            let idx: number;
            let projIds: string[];
            const clientRef = this.db.doc('clients/' + clientId);
            const clientInstance = this.localClientList.find(client => client.id === clientId);
            if (clientInstance) {
                projIds = clientInstance.projectsIds || [];
                idx = projIds.indexOf(projId);
                if (idx === -1) {
                    projIds.push(projId);
                    clientRef.update({ projectsIds: projIds }).then(console.log).catch(console.log);
                }
            } else {
                console.warn('Not able to find client in local clients list');
            }
        }
    }

    unregisterProject(clientId, projId) {
        if (clientId && projId) {
            let idx: number;
            let projIds: string[];
            const clientRef = this.db.doc('clients/' + clientId);
            const clientInstance = this.localClientList.find(client => client.id === clientId);
            if (clientInstance) {
                projIds = clientInstance.projectsIds;
                idx = projIds.indexOf(projId);
                if (idx !== -1) {
                    projIds.splice(idx, 1);
                    clientRef.update({ projectsIds: projIds });
                }
            } else {
                console.warn('Not able to find client in local clients list');
            }
        }
    }
}
