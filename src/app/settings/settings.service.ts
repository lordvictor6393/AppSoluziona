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
      map(AppSettings.getAppSettingsFromSnapshot)
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
