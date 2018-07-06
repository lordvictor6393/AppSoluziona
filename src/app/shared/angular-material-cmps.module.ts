import { NgModule } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from "@angular/material/stepper";

const angularMaterialModules: any[] = [
    MatTabsModule,
    MatButtonModule,
    MatStepperModule
];

@NgModule({
    imports: angularMaterialModules,
    exports: angularMaterialModules
})
export class AngularMaterialCmpsModule {}