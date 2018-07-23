
import { Component } from '@angular/core';
import { Video } from './../video/video';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController   } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { Missions } from '../missions/missions';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  resposeData : any;
  userData = {"username":"", "password":"","firstname":"","lastname":"","id":""};
  constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public loadingCtrl:LoadingController,
        public authService: AuthProvider,
        private toastCtrl:ToastController
      ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  openVideo(){
    this.navCtrl.push(Video);
  }
  login(){
    if(this.userData.username && this.userData.password){
     this.authService.postData(this.userData, "auth").then((result) =>{
       this.resposeData = result;
       console.log(this.resposeData);
       if(this.resposeData.id){
         localStorage.setItem('id', this.resposeData.id );
         localStorage.setItem('login', this.userData.username );
         localStorage.setItem('password', this.userData.password );
         this.navCtrl.push(Missions);
       }
     else{
       this.presentToast("Veuillez donner un nom d'utilisateur et un mot de passe valides");
     }
     }, (err) => {
      this.presentToast("Échec de la connexion");
     });
    }
    else{
     this.presentToast("Donnez votre nom d'utilisateur et mot de passe");
    }

 }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}


