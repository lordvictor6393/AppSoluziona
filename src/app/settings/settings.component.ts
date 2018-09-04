import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SettingsService } from './settings.service';
import { AppSettings } from './settings.model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settingsForm: FormGroup;
  dbAppSettings: AppSettings;

  constructor(
    private settingsService: SettingsService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.settingsForm = new FormGroup({
      entitiesCount: new FormGroup({
        frCount: new FormControl(),
        projectCount: new FormControl()
      }),
      companyData: new FormGroup({
        nit: new FormControl(),
        name: new FormControl()
      })
    });
    this.settingsService.getAppSettings().subscribe(
      appSettings => {
        this.dbAppSettings = appSettings;
        this.loadAppSettings();
      }
    );
  }

  loadAppSettings() {
    const settings = this.dbAppSettings;
    if (settings.entitiesCount) {
      this.settingsForm.patchValue({
        entitiesCount: settings.entitiesCount
      });
    }
    if (settings.companyData) {
      this.settingsForm.patchValue({
        companyData: settings.companyData
      });
    }
  }
  onSaveSettings() {
    const data = this.settingsForm.value;
    console.log('Preferences to be saved', data);
    this.settingsService.saveAppSettings(data)
      .then(() => {
        this.snackBar.open(
          'Configuración guardada.',
          'ok',
          { duration: 4000 }
        );
      })
      .catch(error => {
        console.log(error);
        this.loadAppSettings();
        this.snackBar.open(
          'No se pudo guardar la configuracion.',
          'ok',
          { duration: 4000 }
        );
      });
    this.settingsForm.markAsPristine();
  }

  onResetSettings() {
    this.loadAppSettings();
    this.settingsForm.markAsPristine();
  }
}
