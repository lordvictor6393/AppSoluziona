import { NgModule } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { MatStepperModule } from "@angular/material/stepper";

const angularMaterialModules: any[] = [
    MatTabsModule,
    MatStepperModule
];

@NgModule({
    imports: angularMaterialModules,
    exports: angularMaterialModules
})
export class AngularMaterialCmpsModule {}