import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import  $ from 'jquery';
import {TweenMax} from 'gsap';


declare var Power1,Bounce,Elastic: any;

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class Chat {

  msgChat:any = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private statusBar: StatusBar) {
  }




  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    this.statusBar.overlaysWebView(true);
  }

  
  sendMsgChat(){
    console.log(this.msgChat)
    if(this.msgChat != ""){

      $("#timeLine_chat").append("<div class='wrapMsgChat'><div class='resp_user'>"+this.msgChat+"<div class='time_msg'>18:22</div> </div></div>")
   
    }
    this.msgChat = '';
  }


  BlurScroll(){
    this.statusBar.overlaysWebView(false);
  }

  fixScroll(){
    this.statusBar.overlaysWebView(true);
  }


   

}
