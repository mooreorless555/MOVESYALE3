import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
// import { Globals } from '../pages/functions/functions';

import{ NativeStorage } from 'ionic-native';

import 'rxjs/add/operator/map';

var url = 'http://54.175.164.247:80/';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LoginProvider {

  user;
  token: string;
  social_token: string;

  static get parameters() {
    return [[Http]];
  }

  constructor(public http: Http) {
    console.log('Hello LoginProvider Provider');
  }

  setUser(user) {
    alert("Setting user: " + user);
    this.user = user;
    // this.globals.user = user;
  }

  getUser() {
    alert("In get user: " + JSON.stringify(this.user));
    return this.user;
  }

  updateUser() {
    this.getProfile();
  }

  getToken() {
    return this.token;
  }

  setToken(token) {
    this.token = token;
  }

  doApiLogin(data) {

    var me = this;
    alert(data)

    var body = JSON.stringify({
          name: data[1].name,
          email: data[1].email,
          first_name: data[1].first_name,
          social_token: data[0].authResponse.accessToken
    });

    var headers = new Headers({ 'Content-Type': 'application/json', });
    var options = new RequestOptions({ headers: headers });

    return new Promise((resolve, reject) => {

      this.http.post(url + 'api/FBauthenticate', body, options)
      .map((res) => res.json())
      .subscribe((res) => {

        alert("Response: " + res);



        if(res.success) {

          alert("Got the data: " + res.user + res.token)
          me.user = res.user,
          me.token = res.token

          NativeStorage.setItem('data', {
            token: res.token,
            user: res.user
          });

        }

        resolve(data);

      }, (err) => {
        //alert("Error is doApiLogin(): " + err);
        reject(err);

      });
    });
  }

  getProfile() {

    var me = this;

    var headers = new Headers({ 'Authorization': me.token });
    //alert("Profile: " + me.token);

    return new Promise((resolve, reject) => {

      me.http.get(url + 'api/profile', { headers: headers }).subscribe((res) => {
        //alert(res);
        let data = res.json();
        alert("Profile data: " + JSON.stringify(data, null, 4));
        me.user = data;
        //alert(data);
        resolve(data);

      }, (err) => {

        reject(err);

      })

    });

  }


}
