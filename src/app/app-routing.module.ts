import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AppComponent } from './app.component';
import { HomeComponent } from "./home/home.component";
import { SigninComponent } from "./auth/signin/signin.component";

import { FrListComponent } from './funding-request/fr-list/fr-list.component';
import { FrAddEditComponent } from './funding-request/fr-add-edit/fr-add-edit.component';
// import { FrFormItemComponent } from './funding-request/fr-add-edit/fr-form-item/fr-form-item.component';

import { ErListComponent } from './expense-report/er-list/er-list.component';
import { ErAddEditComponent } from './expense-report/er-add-edit/er-add-edit.component';
// import { ErFormItemComponent } from './expense-report/er-add-edit/er-form-item/er-form-item.component';

import { PListComponent } from './project/p-list/p-list.component';
import { PAddEditComponent } from './project/p-add-edit/p-add-edit.component';

import { UListComponent } from './user/u-list/u-list.component';
import { UAddEditComponent } from './user/u-add-edit/u-add-edit.component';

import { CListComponent } from './client/c-list/c-list.component';
import { CAddEditComponent } from './client/c-add-edit/c-add-edit.component';


const appRoutes: Routes = [{
    path: 'login',
    component: SigninComponent
}, {
    path: '',
    component: HomeComponent,
    children: [{
        path: 'fundingRequests',
        component: FrListComponent
    }, {
        path: 'fundingRequests/create',
        component: FrAddEditComponent
    }, {
        path: 'fundingRequests/:id',
        component: FrAddEditComponent
    }, {
        path: 'expenseReports',
        component: ErListComponent
    }, {
        path: 'expenseReports/create',
        component: ErAddEditComponent
    }, {
        path: 'expenseReports/:id',
        component: ErAddEditComponent
    }, {
        path: 'projects',
        component: PListComponent
    }, {
        path: 'projects/create',
        component: PAddEditComponent
    }, {
        path: 'projects/:id',
        component: PAddEditComponent
    }, {
        path: 'users',
        component: UListComponent
    }, {
        path: 'users/create',
        component: UAddEditComponent
    }, {
        path: 'users/:id',
        component: UAddEditComponent
    }, {
        path: 'clients',
        component: CListComponent
    }, {
        path: 'clients/create',
        component: CAddEditComponent,
        pathMatch: 'full'
    }, {
        path: 'clients/:id',
        component: CAddEditComponent
    }, {
        path: '**',
        redirectTo: '/'
    }]
}];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }