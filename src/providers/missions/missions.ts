import { Injectable } from '@angular/core';
import { Http ,Response ,URLSearchParams} from '@angular/http';
import { LoadingController } from 'ionic-angular';


import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
/*
  Generated class for the MissionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MissionsProvider {
  misLogin = localStorage.getItem('login');
  misPassword = localStorage.getItem('password');
  misType = 'toconfirm';
  loading:any;



  getApiUrl : string = "http://app.camiohub.com/api/beta/missions";
  getApiUrlDetail : string = "http://app.camiohub.com/apiweb/beta/mission";
  //getApiUrlStatus: string ="http://app.camiohub.com/apiweb/beta/missions/#MISSION_ID#/status";
  getApiUrlStatus: string ="http://app.camiohub.com/apiweb/beta/missions";
  getApiUrlConfirm:string;

  constructor(public http: Http, public loadingCtrl: LoadingController) {
    console.log('Hello MissionsProvider Provider');
  }


  showLoading() {
    this.loading = this.loadingCtrl.create({
       content: 'Chargement...'
     });

     this.loading.present();

   }

  getMissions(){
      return  this.http.get(this.getApiUrl+'?user_id='+localStorage.getItem('id'))
            .map((data : Response ) => data.json())
            .do((res : Response ) => console.log(''))
           ;
  }


  public setConfirmedMissions(){
  return  this.http.get(this.getApiUrl+'?user_id='+localStorage.getItem('id'))
          .map((res : Response ) => res.json())
          .do((res : Response ) => console.log(''))
         ;
}

 public doConfirmMissions(IDSMISSIONS){
  
  let data = new URLSearchParams();
  data.append('user_id', localStorage.getItem('id'));
  data.append('orders_id', IDSMISSIONS);
  console.log(IDSMISSIONS);
  let APIautoConfirmation = "http://app.camiohub.com/apiweb/beta/missions/accept?user_id="+localStorage.getItem('id')+"&orders_id="+IDSMISSIONS;
   //console.log(APIautoConfirmation)


   
   return this.http.post(APIautoConfirmation , data);


  //return this.http.get('http://www.tribalddb.ma/apps/ionic/login.php?prenom=jamal&email=jamelnaitsi@gmail.com')
  //.map((res : Response ) => res.json())
}


  getDetail(id){
  return this.http.get(this.getApiUrlDetail+'?login='+this.misLogin+'&password='+this.misPassword+'&id='+id)
          .map((res : Response ) => res.json())
          .do((res : Response ) => console.log(''))
         ;

  }

  public  confirmedMission(mission_id){
    let data = new URLSearchParams();
    data.append('mission_id', mission_id);
    data.append('user_id', localStorage.getItem('id'));
    data.append('comment ', '');
    this.getApiUrlConfirm = "http://app.camiohub.com/apiweb/beta/missions/"+
     mission_id+"/accept?user_id="+localStorage.getItem('id')+"&comment=testApp";
     return  this.http
      .post(this.getApiUrlConfirm, data)

      .map(response  => {
        console.log(response)
        return  response;

      }, error => {
        //this.loading.dismiss();
        console.log(error.json());
      });
  }
  public changeSatus(mission_id,status){
    //this.showLoading();
    let typeValidayion:string;

    console.log("Status CASE : "+status)

          switch(status) {
            case 1: {
              typeValidayion = "validEnRouteVersSiteCh";
              break;
            }
            case 2: {
              typeValidayion = "validcommSurSiteCh";
              break;
            }
            case 3: {
              typeValidayion = "validcommCharge";
              break;
            }
            case 4: {
              typeValidayion = "validcommEnRouteSiteLiv";
              break;
            }
            case 5: {
              typeValidayion = "validcommSurSiteLiv";
              break;
            }
            case 6: {
              typeValidayion = "validcommLivree";
              break;
            }

            default: {
              //statements;
              break;
            }
        }

    let data = new URLSearchParams();
    data.append('mission_id', mission_id);
    data.append('user_id', localStorage.getItem('id'));
    data.append('type_validation', typeValidayion);
    data.append('validation_date', (new Date(), 'yyyy-MM-dd'));
    data.append('status', status);
    //this.getApiUrlStatus = this.getApiUrlStatus+"/"+mission_id+"/status?user_id="+
    //localStorage.getItem('id')+
    //"&type_validation="+typeValidayion+"&comment=FromApp";

     this.getApiUrlStatus = "http://app.camiohub.com/apiweb/beta/missions/status?mission_id="+
     mission_id+"&status="+(status+1)+"&user_id="+localStorage.getItem('id')+"&comment=FromApp";

     return  this.http

     .post(this.getApiUrlStatus, data)

     .map(response  => {

      return  response;

     }, error => {
      //this.loading.dismiss();
      console.log(error.json());
    });




  }

}
