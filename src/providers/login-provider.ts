import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Http, Headers, RequestOptions } from '@angular/http';

import { NativeStorage } from 'ionic-native';

import 'rxjs/add/operator/map';

var url = 'http://54.175.164.247:80/';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LoginProvider {

  public user:any;
  token: string;
  social_token: string;

  static get parameters() {
    return [[Http]];
  }

  constructor(public http: Http) {
    console.log('Hello LoginProvider Provider');
  }

  setUser(user) {
    this.user = user;
  }

  getUser() {
    return firebase.auth().currentUser;
  }

}
