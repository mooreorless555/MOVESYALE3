import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { NativeStorage } from 'ionic-native';
import { ConnectionsPage } from '../connections/connections';
import { FriendsPage } from '../friends/friends';
import { LoginProvider, MoveUser } from '../../providers/login-provider';
import { StatsProvider } from '../../providers/stats-provider';
import { System } from '../functions/functions';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var $          : any;
declare var velocity   : any;

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [StatsProvider, LoginProvider, System]
})
export class ProfilePage {

  ui = {
    friends: {
      name: "Friends",
      desc: "Add, remove and manage friends."
    },
    squads: {
      name: "Squads",
      desc: "Join, create and view your squads. (Coming soon!)"
    }
  }

  user:MoveUser;


  ngAfterViewInit() {
    this.introducePage();
  }


  constructor(public navCtrl: NavController, public loginProvider: LoginProvider, public mUser: MoveUser, public system: System) {
    this.user = this.mUser;
}

  introducePage() {
    $("*[id*=info]").velocity('transition.slideUpIn', { stagger: 300 })
    setTimeout(() => {
    $("*[id*=title]").removeClass('invisible').velocity('transition.slideRightIn', { stagger: 500})
    setTimeout(() => $("*[id*=desc]").removeClass('invisible').velocity('transition.slideRightIn', { stagger: 500 }), 200);
    }, 800)
  }

  goToConnections() {
    this.navCtrl.push(ConnectionsPage);
  }

  goToFriends() {
    this.navCtrl.push(FriendsPage);
  }
}
