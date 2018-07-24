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

  CurrentActiveOrder:any;
  Markers = [];


people = [
    {'name': 'brahim', 'date': '1111111', 'item2': false},
    {'name': 'karim', 'date': '000000', 'item2': false},
    {'name': 'jamel', 'date': '2222222',  'item2': false}
];

sorted = this.people.sort(function(a, b) {
        return b.date < a.date ?  1 // if b should come earlier, push a to end
        : b.date > a.date ? -1 // if b should come later, push a to begin
        : 0;                   // a and b are equal    
   //console.log("A : "+JSON.stringify(a))     
   //console.log("B : "+JSON.stringify(b))
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
          // console.log("A : "+orderA);
          //console.log("B : "+orderB);
          if (orderA > orderB){
            return 1;
          }
          if (orderA < orderB){
            return -1;
          }
          return 0;
        }
        
        this.missionsList.sort(compare);
        this.CurrentActiveOrder=this.missionsList[0];
        console.log("Current Active Order"+JSON.stringify(this.CurrentActiveOrder))
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

        if(typeof this.CurrentActiveOrder.infos_loading.location.geo.lat != typeof undefined){
          console.log("ITS FULL")
          console.log("Geo Order position : "+this.CurrentActiveOrder.infos_loading.location.geo.lat+" / "+this.CurrentActiveOrder.infos_loading.location.geo.lng);
          this.CurrentLat= this.CurrentActiveOrder.infos_loading.location.geo.lat;
          this.CurrentLan= this.CurrentActiveOrder.infos_loading.location.geo.lng;
          this.Markers.push(  {'lan': this.CurrentLat, 'lng': this.CurrentLan, 'info': this.CurrentActiveOrder.infos_loading.location.name, 'icon':'http://maps.google.com/mapfiles/kml/pal5/icon20.png'} );    
        }

        if(this.CurrentActiveOrder.infos_delivery.location.geo.lat != ""){
          console.log("Geo Order position : "+this.CurrentActiveOrder.infos_delivery.location.geo.lat+" / "+this.CurrentActiveOrder.infos_loading.location.geo.lng);
          this.CurrentLat= this.CurrentActiveOrder.infos_delivery.location.geo.lat;
          this.CurrentLan= this.CurrentActiveOrder.infos_delivery.location.geo.lng;
          this.Markers.push(  {'lan': this.CurrentLat, 'lng': this.CurrentLan, 'info': this.CurrentActiveOrder.infos_delivery.location.name, 'icon':'http://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png'} );    
        }        
        
          console.log("Geo Mobile position : "+pos.coords.longitude);
          this.CurrentLat= pos.coords.latitude;
          this.CurrentLan= pos.coords.longitude;
          this.Markers.push(  {'lan': this.CurrentLat, 'lng': this.CurrentLan, 'info': 'Votre position actuelle', 'icon':'iconUser'} );       
      
       
        console.log("Markers array : "+JSON.stringify(this.Markers))
        console.log("Total Markers : "+this.Markers.length);
        this.addMap();


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
    setTimeout(() => {
      if(this.CurrentActiveOrder){
        this.getUserPosition();
      }
     }, 500);
  }


  AdjustMapHeight(){
    this.viewHeight = this.thetopPart.nativeElement.offsetHeight
    console.log( this.viewHeight * 2)
    if (this.platform.is('android')) {
      this.heightMapView = (document.documentElement.clientHeight-(this.viewHeight*2)+10) +"px";
    }
    if (this.platform.is('ios')) {
      this.heightMapView = (document.documentElement.clientHeight-(this.viewHeight*2)+15) +"px";
    }    
  }
  
  addMap(){
    let latLng = new google.maps.LatLng(this.Markers[2].lan, this.Markers[2].lng);
    let mapOptions = {
    center: latLng,
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    }  
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

 // Create a new directionsService object.
 let directionsService = new google.maps.DirectionsService;
  directionsService.route({
   origin: this.Markers[0].lan +','+ this.Markers[0].lng,
   destination: this.Markers[1].lan +','+ this.Markers[1].lng,
   travelMode: 'DRIVING'
 }, function(response, status) {
   if (status === google.maps.DirectionsStatus.OK) {



     let directionsDisplay = new google.maps.DirectionsRenderer({
       suppressMarkers: true,
       map: this.map,
       directions: response,
       draggable: false,
       suppressPolylines: true
       // IF YOU SET `suppressPolylines` TO FALSE, THE LINE WILL BE
       // AUTOMATICALLY DRAWN FOR YOU.
      })
     };
  
  

     // IF YOU WISH TO APPLY USER ACTIONS TO YOUR LINE YOU NEED TO CREATE A 
     // `polyLine` OBJECT BY LOOPING THROUGH THE RESPONSE ROUTES AND CREATING A 
     // LIST
     let pathPoints = response.routes[0].overview_path.map(function (location) {
       return {lat: location.lat(), lng: location.lng()};
     });

     let assumedPath = new google.maps.Polyline({
      path: pathPoints, //APPLY LIST TO PATH
      geodesic: false,
      strokeColor: '#708090',
      strokeOpacity: 0.7,
      strokeWeight: 2.5
    });
    
    assumedPath.setMap(this.map); // Set the path object to the map

  }) 



      this.addMarker(this.Markers);
  }

  

koko(lat,lng){
  var GOOGLE = {lat, lng};
  this.map.setCenter(GOOGLE);
}

  addMarker(Markers){

    for(let ii=0 ; ii < Markers.length; ii++){
         console.log(Markers[ii].lan+" / "+ii+" / "+ Markers[ii].info)
         let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: {lat: Markers[ii].lan, lng: Markers[ii].lng}
          //icon: Markers[ii].icon
          });
 
          let content = "<div id='infoWindow'><p>"+Markers[ii].info+"</p></div>";
          let infoWindow = new google.maps.InfoWindow({
          content: content
          });
    
        google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
        });

    }
    


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
