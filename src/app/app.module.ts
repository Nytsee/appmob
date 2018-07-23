import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Detail } from './../pages/detail/detail';
import { Chat } from './../pages/chat/chat';
import { Missions } from './../pages/missions/missions';
import { Login } from './../pages/login/login';
import { Home } from './../pages/home/home';
import { Video } from '../pages/video/video';
import { Chatlist } from '../pages/chatlist/chatlist';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CdkTableModule } from '@angular/cdk/table';
import { Geolocation } from '@ionic-native/geolocation';


import { MyApp } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatTabsModule} from '@angular/material';
import { AuthProvider } from '../providers/auth/auth';
import { SplitPaneProvider } from '../providers/split-pane/split-pane';
import { MissionsProvider } from '../providers/missions/missions';

@NgModule({
  declarations: [
    MyApp,
    Login,
    Video,
    Chat,
    Detail,
    Home,
    Missions,
    Chatlist

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    CdkTableModule,
    HttpClientModule,
    HttpModule,
    CommonModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp,{
        platforms:{
          ios:{
            scrollAssist: true,
            autoFocusAssist: true,
            scrollPadding: true,
            backButtonText: '',
            statusbarPadding: true
          }
        }
      })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Login,
    Video,
    Chat,
    Home,
    Detail,
    Missions,
    Chatlist

  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    Geolocation,
    SplitPaneProvider,
    MissionsProvider
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
