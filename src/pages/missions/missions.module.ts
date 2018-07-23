import { Missions } from './missions';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    Missions,
  ],
  imports: [
    IonicPageModule.forChild(Missions),
  ],
})
export class MissionsPageModule {}
