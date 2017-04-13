import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar, NativeStorage } from 'ionic-native';

// import { MovesService } from '../pages/services/MovesService';
import { LoginProvider } from '../providers/login-provider';


import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
// import { HomePage } from '../pages/home/home';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  // providers: [System, Globals]
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: LoginPage;

  constructor(public platform: Platform, public loginProvider: LoginProvider) {
    var me = this;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.backgroundColorByHexString('#886FE8');

      // Check if the user is already logged in
      NativeStorage.getItem('data')
        .then(function (data) {
          //alert("Got tokens" + data);
          // user was previously logged in
          // alert("In initial, User token: " + data.token);
          me.loginProvider.setToken(data.token);
          return Promise.all([data, me.loginProvider.getProfile()]);
        })
        .then(function (results) {

          me.loginProvider.setUser(results[1]);

          me.nav.setRoot(TabsPage);


        })
        .catch(function (err) {

          // alert("Couldn't get data");
          //alert('No user found');
          // user not previously logged in
          me.nav.setRoot(LoginPage);

        });

    });
  }
}
