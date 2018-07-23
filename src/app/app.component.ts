import { Login } from './../pages/login/login';
import { Chatlist } from './../pages/chatlist/chatlist';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SplitPaneProvider } from './../providers/split-pane/split-pane';
import { Missions } from '../pages/missions/missions';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public splitPane:SplitPaneProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
        statusBar.overlaysWebView(false);
        statusBar.backgroundColorByHexString('#139CD3');
        splashScreen.hide();
        //console.log(localStorage.getItem('id'))
        if(localStorage.getItem('id')){
          this.rootPage = Missions;
        }else{
          this.rootPage = Login;
        }

    });
  }
}

