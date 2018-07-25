import { Component } from '@angular/core';
import  $ from 'jquery';
import {TweenMax} from 'gsap';
import { Events } from 'ionic-angular';

declare var Power1,Bounce,Elastic: any;

import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { MissionsProvider } from './../../providers/missions/missions';



/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class Detail{
  missionsDetail :any= [];
  loading:any;
  tehRef:any;
  palettes:any = false;
  entireTruck:any = false;
  TotalPalettes:number = 0;
  Status:any;
  mission_id:any;


  StatusInfos = {
    StatusMsg : "",
    StatusIcon : "",
    StatusAlert : "",
    StatusAction : ""
  }
   Delivery_point:any ="Init";
   Loading_point:any ="Init";

   id_activeOrder:any;



   MsgStatus:any = [
    ["pan_tool","En attente de confirmation","La mission est en Attente. Veuillez confirmer...","Confirmer"],
    ["check_circle" ,"Confirmée", "La mission est confirmée. Cliquez sur en Route avant de vous diriger vers le lieu de chargement","En Route"],
    ["swap_calls","En route vers site de chargement", "Vous êtes en route vers le site de chargement <strong>“#DESTINATION#”.</strong> Cliqué sur \"Arrivé\" si vous êtes arrivé", "Arrivé"],
    ["flag","Sur site de chargement", "Vous êtes sur site de chargement <strong>“#DESTINATION#”.</strong> Cliqué sur \"chargé\" lorsque la marchandise est chargé", "Chargé"],
    ["publish","Marchandise chargée", "La marchandise est chargée. Cliqué sur \"En route\" pour vous diriger vers le site de livraison", "En route"],
    ["directions_walk","En route vers site de livraison","Vous êtes en route vers le site de livraison <strong>“#DESTINATION#”.</strong> Cliqué sur \"Arrivé\" si vous êtes arrivé","Arrivé"],
    ["location_on","Sur site de livraison","Vous êtes sur site de livraison <strong>“#DESTINATION#”.</strong> Cliqué sur \"livré\" lorsque la Livraison est terminée","Livré"],
    ["thumb_up","Marchandise Livrée","La marchandise est livrée !! texte manquant pour cet status <strong>“#DESTINATION#”.</strong> Cliqué sur \"Arrivé\" si vous êtes arrivé","Arrivé"]
  ];




  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public missionservice :MissionsProvider,
    private toastCtrl:ToastController,
    public events: Events,
    public loadingCtrl: LoadingController) {

    let id_detail = navParams.get('id_detail');
    this.id_activeOrder = navParams.get('id_activeOrder');
    console.log("______ID_________"+this.id_activeOrder)
    //console.log(id_detail)
    this.getdetail(id_detail);
    console.log("Detail array : "+this.missionsDetail)
    console.log("Messaaaage : "+this.MsgStatus[0][2])
  }

  

  showLoading() {
   this.loading = this.loadingCtrl.create({
      content: 'Chargement...'
    });

    this.loading.present();

  }


  updateMsgStatus(statusID){
    this.Status = statusID;
    this.StatusInfos.StatusIcon = this.MsgStatus[statusID][0];
    this.StatusInfos.StatusMsg = this.MsgStatus[statusID][1];
    this.StatusInfos.StatusAction = this.MsgStatus[statusID][3];

    console.log("Status : "+statusID+"To "+this.Loading_point)


      if((statusID == 2) || (statusID == 3)){
        this.StatusInfos.StatusAlert = this.MsgStatus[statusID][2].replace("#DESTINATION#",this.Loading_point);
      }else{
        this.StatusInfos.StatusAlert = this.MsgStatus[statusID][2].replace("#DESTINATION#",this.Delivery_point);      
      }
  }


  getdetail(id)
      {
       //this.showLoading()
        this.missionservice.getDetail(id).subscribe(
          data => { this.missionsDetail = data;
          this.missionsDetail = Array.of(this.missionsDetail);
          console.log("Details Order : "+JSON.stringify(this.missionsDetail))
          console.log("ID : "+this.missionsDetail[0].id)
          //this.loading.dismiss();
          this.tehRef =
                      this.missionsDetail[0].reference +
                      " | "+this.missionsDetail[0].infos_loading.location.name+
                      " > "+
                      this.missionsDetail[0].infos_delivery.location.name ;

        this.Delivery_point = this.missionsDetail[0].infos_delivery.location.name;
        this.Loading_point = this.missionsDetail[0].infos_loading.location.name;
        this.Status = this.missionsDetail[0].status;
        this.mission_id = this.missionsDetail[0].id;

        this.updateMsgStatus(this.Status);

        console.log("Current statgus : "+ this.Status)
         if(this.missionsDetail[0].hasOwnProperty('load_detail')){
              //We check for the palettes entries
              if(this.missionsDetail[0].load_detail.hasOwnProperty('pallets')){
                this.palettes = this.missionsDetail[0].load_detail.pallets;
                for(let ii=0; ii<this.palettes.length; ii++){
                  this.TotalPalettes += this.palettes[ii].quantity;
                }
                console.log("Total Palettes : "+ this.TotalPalettes);
                console.log(" Palettes object "+JSON.stringify(this.palettes));
              }

              //We check for the Entire_truck entries
              if(this.missionsDetail[0].load_detail.hasOwnProperty('entire_truck')){
              this.entireTruck =  this.missionsDetail[0].load_detail.entire_truck;
              }
          }//End check detail property



          setTimeout(function(){
            $(".readMoreDetail span:eq(1)").hide();
            if(this.id_activeOrder == this.mission_id){
              $(".instructionOrder").slideDown(250);
            }
            TweenMax.staggerFrom(".elem_order_detail", 1.5, {opacity:0, y:20, ease:Elastic.easeOut, force3D:true}, 0.2);
          }, 5);
      },
          err => console.error(err),
          () => console.log('getdetail completed')
      );
     }

  public animateBoxs(){
    TweenMax.staggerFrom(".elem_order_detail", 1.5, {opacity:0, y:20, ease:Elastic.easeOut, force3D:true}, 0.2);
  }




  public showDetail:boolean = false ;
  public isShown:boolean = false ;


  public showEntrepotInfos(idx){
      $(".entrepotBoxInfos").hide();
      $(".elem_order_detail").stop().fadeTo(300,0,function(){
        //$(".elem_order_detail").hide();
        TweenMax.fromTo ($(".backBtn") , 1.5, { x:20, opacity:0}, {x:0, opacity:1, delay:0.3, ease:Elastic.easeOut, force3D:true})
        TweenMax.fromTo ($(".entrepotBoxInfos:eq("+idx+")") , 1, { top:"30px", opacity:0}, {top:0, opacity:1,display:'block', delay:0, ease:Elastic.easeOut, force3D:true , onComplete:function(){ $(".backBtn").addClass("ok")}})
      });

  }

  public detailEntrepot(idx){
    TweenMax.staggerTo(".elem_order_detail", 0.3, {opacity:0, scale:0.8, onCompleteParams:[idx]}, 0.2, this.showEntrepotInfos(idx));
  }

  public closeDetail(){
    $(".entrepotBoxInfos").slideUp(function(){
      TweenMax.staggerTo(".elem_order_detail", 1.5, {opacity:1, y:0, scale:1, ease:Elastic.easeOut, force3D:true}, 0.2, function(){ $(".backBtn").removeClass('ok')});
      $(".elem_order_detail").stop().slideDown(400,function(){

      });
    });
  }



  public showDetailMarchandise(){
        $(".elem_order_detail").css({"height":"auto"})
        if(this.showDetail == false){
          this.showDetail = true ;
          $("#detailsMarchandise").stop().slideDown(250,function(){
            $(".readMoreDetail span:eq(0)").hide();
            $(".readMoreDetail span:eq(1)").show();
          })
        }else if(this.showDetail == true){
          this.showDetail = false ;
          $("#detailsMarchandise").stop().slideUp(250,function(){
            $(".readMoreDetail span:eq(0)").show();
            $(".readMoreDetail span:eq(1)").hide();
          })
        }
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad DetailPage');
      this.animateBoxs()
      $(".readMoreDetail span:eq(1)").hide();
  }


  ngOnInit() {
    //We close all visible Entrepots sections
    $(".backBtn").click(function(){
      alert('okii')
      if(!$(this).hasClass("ok")){ return false; }
      $(".entrepotBoxInfos").slideUp(function(){
        TweenMax.staggerTo(".elem_order_detail", 1.5, {opacity:1, y:0, scale:1, ease:Elastic.easeOut, force3D:true}, 0.2, function(){ $(".backBtn").removeClass('ok')});
        $(".elem_order_detail").stop().slideDown(400,function(){

        });
      });
    })
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  changueStatus(){
    if(this.Status==0){
      this.missionservice.confirmedMission(this.mission_id).subscribe((data)=>{
        let sdata:string =  JSON.parse(data['_body']);
        if(data.ok ==true && data.status==200){
          this.updateMsgStatus(sdata['status']);
          //this.loading.dismiss();
        }

      });
    }else{
      this.missionservice.changeSatus(this.mission_id,this.Status).subscribe((data)=>{
        let sdata:string =  JSON.parse(data['_body']);
        if(data.ok ==true && data.status==200){
          this.updateMsgStatus(sdata['status']);
          //this.loading.dismiss();
        }

      });
    }



  }

}
