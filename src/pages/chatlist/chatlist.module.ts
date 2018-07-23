import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Chatlist } from './chatlist';

@NgModule({
  declarations: [
    Chatlist,
  ],
  imports: [
    IonicPageModule.forChild(Chatlist),
  ],
})
export class ChatlistPageModule {}
