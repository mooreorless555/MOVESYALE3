import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { NativeStorage } from 'ionic-native';
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

  user:MoveUser;


  ngAfterViewInit() {
    this.introducePage();
  }


  constructor(public navCtrl: NavController, public loginProvider: LoginProvider, public mUser: MoveUser, public system: System) {
    this.user = this.mUser;
}

  introducePage() {
    $("*[id*=info]").velocity('transition.slideUpIn', { stagger: 300 })
  }

}
