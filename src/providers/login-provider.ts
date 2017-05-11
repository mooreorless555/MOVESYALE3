import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { NavController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { Http } from '@angular/http';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
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

  subscription: any;
  friendRequestsList: FirebaseListObservable<any>;

  null_user = {
    uid: "999999999",
    displayName: "NULL_USER",
    email: "nobody@yale.edu",
    photoURL: "http://graph.facebook.com/1248413801916793/picture?height=400",
    providerData: {
      id: "5678910202",
      name: "NULL_USER_FB",
      first_name: "NULL_USER_FB_FIRST_NAME",
      friends: {
        data: [{name: "Alika Smith (Fake)", id: '100000976637882'},{name: "Chris Moore (Fake)", id: '1248413801916793'},]
      }
    },
    friends: {
      members: [],
      requests_recv: [],
      requests_sent: []
    }
  }

  public user: any = {}
  public providerData: any;


  constructor(public af: AngularFire) {
  }

  initUser() {
    let user = this.getFB()
    let userInfo = {
      name: user.name,
      friends: {
        members: [],
        requests_recv: [],
        requests_sent: []
      },
      info: {
        picture: {
          prof: 'http://graph.facebook.com/' + user.id + '/picture?height=400',
          square: 'http://graph.facebook.com/' + user.id + '/picture?type=square'
        }
      }
    }

    /* Initialize user in the database. */
    firebase.database()
      .ref('userData/' + user.id)
      .set(userInfo)
      .then(() => console.log('User initialized.'))
      .catch((e) => console.log('User not initalized: ', e))
  }

  get() {
    if (!firebase.auth().currentUser) return this.null_user;
    return firebase.auth().currentUser;
  }

  getUserData(fbid) {
    return firebase.database().ref('userData/').orderByKey().equalTo(fbid)
  }

  getPhoto(fbid) {
    let res = {
      prof: 'http://graph.facebook.com/' + fbid + '/picture?height=400',
      square: 'http://graph.facebook.com/' + fbid + '/picture?type=square'
    }
    return res;
  }

  getFB() {
    if (!firebase.auth().currentUser) return this.null_user.providerData;
    return this.providerData[1];
  }

  setFB(info) {
    this.providerData = info;
  }

  getConnectionsCount() {
    if (!this.getFB().friends.data.length) return this.null_user.providerData.friends.data.length;
    return this.getFB().friends.data.length;
  }

  getConnections() {
    if (!this.getFB().friends.data) return this.null_user.providerData.friends.data;
    return this.getFB().friends.data;
  }


  isConnection(fbid, friendlist) {
    for (let i = 0; i < friendlist.length; i++) {
      if (fbid == friendlist[i].id) {
        return true;
      }
    }
    return false;
  }

  getConnectionByID(fbid) {
    var friendlist = this.getConnections()
    console.log('Friends list: ', friendlist)
    for (let i = 0; i < friendlist.length; i++) {
      if (fbid == friendlist[i].id) {
        return friendlist[i];
      }
    }
    return null;
  }

  getFriends() {
    let user = this.getFB()
    let ref = firebase.database().ref('userData/'+user.id+'/friends/members')
    return ref;
  }

  isFriend(fbid) {
    let user = this.getFB()
    let ref = this.getFriends().orderByKey().equalTo(fbid);
    return ref;
  }

  isPending(fbid) {
    let user = this.getFB()
    let ref = firebase.database().ref('userData/'+user.id+'/friends/requests_sent').orderByKey().equalTo(fbid)
    return ref;
  }

  addFriend(fbid) {
    let user = this.getFB()
    let member = this.getConnectionByID(fbid)
    let memberInfo;
    if (!member) 
      memberInfo = {
        id: member.id,
        name: "Alika Smith"
      }
    else
      memberInfo = {
        id: member.id,
        name: member.name
      }
    console.log('UserID: ', user.id)
    let ref = this.getUserData(user.id)
    ref.once('child_added', snap => {
      snap.ref.child('friends').child('members').child(fbid).update(memberInfo)
    })
  }

  acceptFriend(fbid) {
    let user = this.getFB()
    let refYou = this.getUserData(user.id)
    refYou.once('child_added', snap => {
      snap.ref.child('friends').child('requests_recv').child(fbid).update(null);
    })

    let refThem = this.getUserData(fbid)
    refThem.once('child_added', snap => {
      snap.ref.child('friends').child('requests_sent').child(user.id).update(null);
    })

    // this.addFriend(fbid)
  }

  sendFriendRequest(fbid) {
    console.log('Sending friend request...');
    let user = this.getFB()
    let member = this.getConnectionByID(fbid)
    if (!member) member = {id: '1248413801916793', name: 'Fake Chris'}
    console.log("User " + user.id + " sending request to User " + fbid)
    
    let refYou = this.getUserData(user.id)
    refYou.once('child_added', snap => {
      snap.ref.child('friends').child('requests_sent').child(fbid).update({id: member.id, name: member.name})
    })

    let refThem = this.getUserData(fbid)
    refThem.once('child_added', snap => {
      snap.ref.child('friends').child('requests_recv').child(user.id).update({id: user.id, name: user.name})
    })
  }

  getFriendRequests(fbid) {
    this.friendRequestsList = this.af.database.list('/userData/'+fbid+'/friends/requests_recv/')
    this.subscription = this.friendRequestsList.subscribe().unsubscribe()
  }
}
