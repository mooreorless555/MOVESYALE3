import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { NativeStorage } from 'ionic-native';
import { LoginProvider } from '../../providers/login-provider';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
  //providers: [LoginProvider]
})
export class ProfilePage {

	public user;

  /*
	ngAfterViewInit() {
    var me = this;

		NativeStorage.getItem('user')
      		.then(function(user) {
            //alert("Got tokens: " + user);
        		return Promise.all([user, me.loginProvider.getProfile()]);
      		})
      		.then(function(results) {
            alert(results);
            alert(results[1]);
        		me.user = results[1];
            //alert("Updated user: " + me.user);
      		})
      		.catch(function(err) {
        		alert("Couldn't get user info, error: " + err);
      		});
	}
  */

  	constructor(public navCtrl: NavController, public loginProvider: LoginProvider) {
      this.user = this.loginProvider.getUser();

      alert(this.user.moves[0].info.name);
    }

}
