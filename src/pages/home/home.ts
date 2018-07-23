import { Chat } from './../chat/chat';
import { Missions } from './../missions/missions';
import { Video } from './../video/video';
import { Detail } from './../detail/detail';
import { Login } from './../login/login';
import { Component } from '@angular/core';
import { Chatlist } from './../chatlist/chatlist';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class Home {
  

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Home');
  }

  openLogin(){
    this.navCtrl.push(Login);
  }
  openVideo(){
    this.navCtrl.push(Video);
  }

  openChat(){
    this.navCtrl.push(Chat);
  }

  openMissions(){
    this.navCtrl.push(Missions);
  }

  openDetail(){
    this.navCtrl.push(Detail);
  }

  openChatlist(){
    this.navCtrl.push(Chatlist);
  }

  
}
