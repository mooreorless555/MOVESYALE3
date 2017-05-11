import { Component, trigger, style, animate, transition } from '@angular/core';
import firebase from 'firebase';
import { MoveUser } from '../../providers/login-provider';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ConnectionsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var $: any;
declare var velocity: any;

@Component({
  selector: 'page-connections',
  templateUrl: 'connections.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(100, style({ opacity: 0 })),
        animate(100, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(100, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ConnectionsPage {

  conRef: any;
  connectionsList: any;
  lconnectionsList: any; // preloaded to reduce server calls
  actualList: any;
  actualListf: any;
  random: number;
  status = [];

  ui = {
    title: "Add Friends",
    info: {
      title: "YOUR FACEBOOK CONNECTIONS",
      status: {
        a: "SEND REQUEST",
        b: "REQUEST SENT",
        c: "FRIENDS"
      }
    }
  }

  ngAfterViewInit() {
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public mUser: MoveUser) {
    this.lconnectionsList = this.mUser.getConnections();
    this.connectionsList = this.lconnectionsList;
    this.updateList();
    this.random = 0;

  }

  updateList() {
    if (arguments[0]) this.mUser.sendFriendRequest(arguments[0]);
    this.actualListf = [];
    for (let con of this.connectionsList) {
      this.mUser.isFriend(con.id).once('value', s => {
        if (s.val() != null) this.actualListf.push({ id: con.id, name: con.name, status: 2 });
      });

      this.mUser.isPending(con.id).once('value', s => {
        if (s.val() != null) this.actualListf.push({ id: con.id, name: con.name, status: 1 });
        else this.actualListf.push({ id: con.id, name: con.name, status: 0 });
      })
    }
    this.actualList = this.actualListf;
  }

  introducePage() {
  }

  onInput(searchbar) {
    // Reset items back to all of the items
    this.actualList = this.actualListf;

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;


    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.actualList = this.actualList.filter((v) => {
      if (v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    console.log(q, this.connectionsList.length);

  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad ConnectionsPage');
  }

  checkFriendStatus(fbid, i) {
    this.status[i] == 0;
    let user = this.mUser.getFB()
    let refYou = this.mUser.getUserData(user.id)
    refYou.once('value', snap => {
      if (snap.ref.child('friends').child('requests_sent').orderByChild(fbid)) this.status[i] == 1;
      if (snap.ref.child('friends').child('members').orderByChild(fbid)) this.status[i] == 2;
    })
  }

  buttonClick() {
    this.random++;
  }

}
