import { NgModule } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from "@angular/material/stepper";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';

const angularMaterialModules: any[] = [
    MatTabsModule,
    MatButtonModule,
    MatStepperModule,
    MatSelectModule,
    MatInputModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatTableModule,
    MatNativeDateModule
];

@NgModule({
    imports: angularMaterialModules,
    exports: angularMaterialModules
})
export class AngularMaterialCmpsModule {}