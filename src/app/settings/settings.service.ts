import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { AppSettings } from './settings.model';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {
  private settingsCollection: AngularFirestoreCollection<AppSettings>;
  constructor(private db: AngularFirestore) {
    this.settingsCollection = this.db.collection('appConfig');
  }

  getAppSettings(): Observable<AppSettings> {
    return this.settingsCollection.snapshotChanges().pipe(
      map(configDocs => {
        let counts = configDocs.find(doc => doc.payload.doc.id === 'entitiesCount');
        let companyData = configDocs.find(doc => doc.payload.doc.id === 'companyData');

        if (counts) { counts = counts.payload.doc.data(); }
        if (companyData) { companyData = companyData.payload.doc.data(); }
        return new AppSettings(counts, companyData);
      })
    );
  }

  saveAppSettings(settings) {
    const countsDocRef = this.db.doc('appConfig/entitiesCount');
    const companyDataDocRef = this.db.doc('appConfig/companyData');

    return Promise.all([
      countsDocRef.set(settings.entitiesCount),
      companyDataDocRef.set(settings.companyData)
    ]);
  }
}
