import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// COMPONENTS
import { AppComponent } from './app.component';
// Funding request
import { FrListComponent } from './funding-request/fr-list/fr-list.component';
import { FrAddEditComponent } from './funding-request/fr-add-edit/fr-add-edit.component';
import { FrFormItemComponent } from './funding-request/fr-add-edit/fr-form-item/fr-form-item.component';
// Expense Report
import { ErListComponent } from './expense-report/er-list/er-list.component';
import { ErAddEditComponent } from './expense-report/er-add-edit/er-add-edit.component';
import { ErFormItemComponent } from './expense-report/er-add-edit/er-form-item/er-form-item.component';
// Project
import { PListComponent } from './project/p-list/p-list.component';
import { PAddEditComponent } from './project/p-add-edit/p-add-edit.component';
// User
import { UListComponent } from './user/u-list/u-list.component';
import { UAddEditComponent } from './user/u-add-edit/u-add-edit.component';
// Client
import { CListComponent } from './client/c-list/c-list.component';
import { CAddEditComponent } from './client/c-add-edit/c-add-edit.component';
// Generic
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

// MODULES
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore'
import { AngularFireStorageModule } from 'angularfire2/storage'
import { AngularFireAuthModule } from 'angularfire2/auth'

// SERVICES
import { FundingRequestService } from './funding-request/funding-request.service';
import { environment } from '../environments/environment';
import { ClientService } from './client/client.service';

@NgModule({
  declarations: [
    AppComponent,
    FrListComponent,
    FrAddEditComponent,
    FrFormItemComponent,
    ErListComponent,
    ErAddEditComponent,
    ErFormItemComponent,
    PListComponent,
    PAddEditComponent,
    UListComponent,
    UAddEditComponent,
    CListComponent,
    CAddEditComponent,
    HeaderComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule
  ],
  providers: [
    ClientService,
    FundingRequestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
