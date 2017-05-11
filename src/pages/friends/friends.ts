import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MoveUser } from '../../providers/login-provider';
import { ConnectionsPage } from '../connections/connections';

/**
 * Generated class for the Friends page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var $: any;
declare var velocity: any;

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {

  friendRequestsList: any;

  ui = {
    title: "Friends",
    info: {
      title: "INCOMING FRIEND REQUESTS",
      status: {
          a: "ACCEPT",
          b: "REQUEST SENT",
          c: "FRIENDS",
          num: 0
      },
    }
  }

  ngAfterViewInit() {
    this.introducePage();
    var me = this;
    $('#add').on('click', function (e) {me.goToConnections()})
  }


  constructor(public navCtrl: NavController, public navParams: NavParams, public mUser: MoveUser) {
    this.mUser.getFriendRequests(this.mUser.getFB().id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Friends');
  }

  goToConnections() {
    this.navCtrl.push(ConnectionsPage);
  }

  introducePage() {
    $('*[id*=plus]').velocity({ opacity: 1 }, { duration: 700, easing: "easeOutExpo"})
    $('*[id*=add]').velocity({opacity: 1}, { duration: 700 , easing: "ease-in-out"}).velocity({ scale: 1.3 }, { duration: 3000, loop: true });
  }

}
