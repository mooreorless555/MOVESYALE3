import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { NavController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { TabsPage } from '../pages/tabs/tabs';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// var url = 'http://54.175.164.247:80/';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LoginProvider {

  public user: any;
  token: string;
  social_token: string;

  static get parameters() {
    return [[Http]];
  }

  constructor(public http: Http, private facebook: Facebook, public mUser: MoveUser, public navCtrl: NavController) {
    console.log('Hello LoginProvider Provider');
  }


  setUser(user) {
    this.user = user;
  }

  getUser() {
    let null_user = {
      uid: "999999999",
      displayName: "NULL_USER",
      email: "nobody@yale.edu"
    }
    if (!firebase.auth().currentUser) return null_user;
    return firebase.auth().currentUser;
  }

}

@Injectable()
export class MoveUser {

  null_user = {
    uid: "999999999",
    displayName: "NULL_USER",
    email: "nobody@yale.edu",
    photoURL: "https://s-media-cache-ak0.pinimg.com/originals/cf/d0/25/cfd025d44dc2f2638a8cede78a8968b9.png",
    providerData: {
      id: "5678910202",
      name: "NULL_USER_FB",
      first_name: "NULL_USER_FB_FIRST_NAME",
      friends: {
        data: [{name: "Alika", id: '5678910202'}]
      }
    }
  }

  public user: any = {}
  public providerData: any;


  constructor() {
  }

  get() {
    if (!firebase.auth().currentUser) return this.null_user;
    return firebase.auth().currentUser;
  }

  getFB() {
    if (!firebase.auth().currentUser) return this.null_user.providerData;
    return this.providerData[1];
  }

  setFB(info) {
    this.providerData = info;
  }

  getFriendCount() {
    if (!this.getFB().friends.data.length) return this.null_user.providerData.friends.data.length;
    return this.getFB().friends.data.length;
  }

  getFriends() {
    if (!this.getFB().friends.data) return this.null_user.providerData.friends.data;
    return this.getFB().friends.data;
  }

  isFriend(fbid, friendlist) {
    for (let i = 0; i < friendlist.length; i++) {
      if (fbid == friendlist[i].id) {
        return true;
      }
    }
    return false;
  }

  getFriendByID(fbid) {
    var friendlist = this.getFriends()
    console.log('Friends list: ', friendlist)
    for (let i = 0; i < friendlist.length; i++) {
      if (fbid == friendlist[i].id) {
        return friendlist[i];
      }
    }
    return null;
  }
}
