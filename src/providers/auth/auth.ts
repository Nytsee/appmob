import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';
import { Headers } from '@angular/http';
import { OnInit } from '@angular/core';
import { RequestOptions, Request, RequestMethod } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

let apiUrl = 'http://app.camiohub.com/apiweb/beta/authentification?';


// Change mission status by group
// http://app.camiohub.com/apiweb/beta/status?login=despatch10&password=123456&
// user_id=63&orders_id=233&status=1&comment=&validation_date=2018-07-11%2012:26

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  constructor(public http: Http) {
    console.log('Hello AuthProvider Provider');
  }
  postData(credentials, type){

      return new Promise((resolve, reject) =>{
        let headers = new Headers();
        //type, JSON.stringify(credentials), {headers: headers}
        this.http.get(apiUrl+'login='+credentials.username+'&password='+credentials.password).
        subscribe(res =>{
          resolve(res.json());
        }, (err) =>{
          reject(err);
        });

      });

  }
}
