import { Component, ViewChild ,ElementRef } from '@angular/core';

import  $ from 'jquery';
import {TweenMax} from 'gsap';

import { MissionsProvider } from './../../providers/missions/missions';
import { IonicPage, NavController, NavParams,ToastController, Platform } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { Detail } from '../detail/detail';


declare var google;
declare var offsetHeight;


/**
 * Generated class for the MissionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-missions',
  templateUrl: 'missions.html',
})
export class Missions {
  missionsList = [];
  currentDate: string = new Date().toISOString();
  options : GeolocationOptions;
  currentPos : Geoposition;
  heightMapView : string;
  viewHeight: number;

  CurrentLat:any;
  CurrentLan:any;


people = [
    {'name': 'brahim', 'date': '1111111', 'item2': false},
    {'name': 'karim', 'date': '3333333', 'item2': false},
    {'name': 'jamel', 'date': '2222222',  'item2': false}
];

sorted = this.people.sort(function(a, b) {
        return b.date < a.date ?  1 // if b should come earlier, push a to end
        : b.date > a.date ? -1 // if b should come later, push a to begin
        : 0;                   // a and b are equal    
   // console.log("A : "+JSON.stringify(a))     
   // console.log("B : "+JSON.stringify(b))
});






  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('currentHeader') thetopPart: ElementRef;
  map: any;


 

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public missionservice :MissionsProvider,
    private toastCtrl:ToastController,
    private geolocation : Geolocation) {    
    this.getMissions();
  }

  IconMission:any = [
    ["pan_tool"],
    ["check_circle"],
    ["swap_calls"],
    ["flag"],
    ["publish"],
    ["directions_walk"],
    ["location_on"],
    ["thumb_up"]
  ];

  

  ionViewDidLoad() {
    let ToConfirme = new Array();
    console.log('ionViewDidLoad MissionsPage');
    this.missionservice.setConfirmedMissions().subscribe((data)=>{
      if(data) {
        
        data.forEach(function (value) {
            console.log(" status to confirm : "+value.status+" Val ID : "+value.id); 
            if(value.status == 0){
             ToConfirme.push(value.id);
            } 
        });

        // We check if there is some order to confirm automaticaly
        if(ToConfirme.length > 0){
          this.missionservice.doConfirmMissions(ToConfirme)
          .subscribe(res => {
            console.log(res);
            this.getMissions();
            });
        }


      }else{
        this.presentToast("aucune mission enregistrer");
      }

        //console.log("Missions : "+JSON.stringify(this.missionsList[0].infos_loading.location.time_start));
        console.log(" Total : "+this.missionsList.length)

        function compare(a,b) {
          let orderA = (a.status < 4) ? a.infos_loading.location.time_start : a.infos_delivery.location.time_start ;
          let orderB = (b.status < 4) ? b.infos_loading.location.time_start : b.infos_delivery.location.time_start ;
          if (orderA > orderB){
            return 1;
          }
          if (orderA < orderB){
            return -1;
          }
          return 0;
        }
        
        this.missionsList.sort(compare);
        console.log("Sorted Missions : "+JSON.stringify(this.missionsList))


    });

    console.log("Array Sorted : "+JSON.stringify(this.sorted));
  }


  //declartation des foncion pour la map google

  getUserPosition(){

    this.options = {
    enableHighAccuracy : true
    };

    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

        this.currentPos = pos;

        console.log("Geo position : "+pos.coords.longitude);
        this.CurrentLat= pos.coords.latitude;
        this.CurrentLan= pos.coords.longitude;
        this.addMap(pos.coords.latitude,pos.coords.longitude);

    },(err : PositionError)=>{
        console.log("error : " + err.message);
    ;
    })
  

    //Let's watch position continually while status equal to 2 or 4,
    //we have to know whats the current active order 
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
    // data can be a set of coordinates, or an error (if an error occurred).
    console.log("_____WATCH_____"+data.coords.longitude+" / "+data.coords.latitude);
    //data.coords.latitude
    //data.coords.longitude
    });


    this.AdjustMapHeight();
  }


  ionViewDidEnter(map){
    this.getUserPosition();
  }


  AdjustMapHeight(){
    this.viewHeight = this.thetopPart.nativeElement.offsetHeight
    console.log( this.viewHeight * 2)
    if (this.platform.is('android')) {
      this.heightMapView = (document.documentElement.clientHeight-(this.viewHeight*2)+10) +"px";
    }
    if (this.platform.is('ios')) {
     
      this.heightMapView = (document.documentElement.clientHeight-(this.viewHeight*2)-5) +"px";
    }    
  }
  
  addMap(lat,long){

    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
		center: latLng,
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker();
  }

koko(lat,lng){
  var GOOGLE = {lat, lng};
  this.map.setCenter(GOOGLE);
}

  addMarker(){

    let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter()
    });

    let content = "<div id='infoWindow'><p>Votre position actuelle!</p></div>";
    let infoWindow = new google.maps.InfoWindow({
    content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
    });

  }

  getMissions(){
    this.missionservice.getMissions().subscribe((data)=>{
      if(data) {
        this.missionsList = data;
        console.log("La list des missions : " +this.missionsList)
      }else{
        this.presentToast("aucune mission enregistrer");
      }

        console.log(this.missionsList);
    });
  }


  
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  detail(id){
    //console.log(id)
    this.navCtrl.push(Detail, {
      id_detail: id
    });
  }
}
