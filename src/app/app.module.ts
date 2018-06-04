import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { FrListComponent } from './funding-request/fr-list/fr-list.component';
import { FrAddEditComponent } from './funding-request/fr-add-edit/fr-add-edit.component';
import { FrFormItemComponent } from './funding-request/fr-add-edit/fr-form-item/fr-form-item.component';

import { ErListComponent } from './expense-report/er-list/er-list.component';
import { ErAddEditComponent } from './expense-report/er-add-edit/er-add-edit.component';
import { ErFormItemComponent } from './expense-report/er-add-edit/er-form-item/er-form-item.component';

import { PListComponent } from './project/p-list/p-list.component';
import { PAddEditComponent } from './project/p-add-edit/p-add-edit.component';

import { UListComponent } from './user/u-list/u-list.component';
import { UAddEditComponent } from './user/u-add-edit/u-add-edit.component';

import { CListComponent } from './client/c-list/c-list.component';
import { CAddEditComponent } from './client/c-add-edit/c-add-edit.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

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
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
