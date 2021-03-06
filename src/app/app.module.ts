import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import localeEs from '@angular/common/locales/es-BO';

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
import { AppRoutingModule } from './shared/app-routing.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialCmpsModule } from './shared/angular-material-cmps.module';

// SERVICES
import { ExpenseReportService } from './expense-report/expense-report.service';
import { FundingRequestService } from './funding-request/funding-request.service';
import { environment } from '../environments/environment';
import { ClientService } from './client/client.service';
import { SigninComponent } from './auth/signin/signin.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './auth/auth.service';
import { UsersService } from './user/user.service';
import { ProjectService } from './project/project.service';

import { registerLocaleData } from '../../node_modules/@angular/common';
import { RejectReasonComponent } from './funding-request/reject-reason/reject-reason.component';
import { FrSelectorComponent } from './expense-report/er-list/fr-selector/fr-selector.component';
import { FrPrintPreviewComponent } from './funding-request/fr-print-preview/fr-print-preview.component';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { ErPrintPreviewComponent } from './expense-report/er-print-preview/er-print-preview.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsService } from './settings/settings.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardService } from './dashboard/dashboard.service';


registerLocaleData(localeEs, 'es-BO');

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
    SidebarComponent,
    SigninComponent,
    HomeComponent,
    RejectReasonComponent,
    FrSelectorComponent,
    FrPrintPreviewComponent,
    ErPrintPreviewComponent,
    SettingsComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialCmpsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    PDFExportModule
  ],
  entryComponents: [
    FrFormItemComponent,
    ErFormItemComponent,
    RejectReasonComponent,
    FrSelectorComponent,
    FrPrintPreviewComponent,
    ErPrintPreviewComponent
  ],
  providers: [
    AuthService,
    UsersService,
    ClientService,
    ProjectService,
    SettingsService,
    FundingRequestService,
    ExpenseReportService,
    DashboardService,
    { provide: LOCALE_ID, useValue: 'es-BO' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
