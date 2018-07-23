import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Video } from './video';

@NgModule({
  declarations: [
    Video,
  ],
  imports: [
    IonicPageModule.forChild(Video),
  ],
})
export class VideoPageModule {}
