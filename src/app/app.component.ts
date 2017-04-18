import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { LoginProvider } from '../providers/login-provider';
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  // providers: [System, Globals]
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: LoginPage;

  constructor(public platform: Platform, public loginProvider: LoginProvider, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    var me = this;
    // firebase.initializeApp({
    //   apiKey: "AIzaSyANmdr_oNcjak8eVKUI7esAoyk4mtWKD-M",
    //   authDomain: "moves-ad1b4.firebaseapp.com",
    //   databaseURL: "https://moves-ad1b4.firebaseio.com",
    //   projectId: "moves-ad1b4",
    //   storageBucket: "moves-ad1b4.appspot.com",
    //   messagingSenderId: "583373480587"
    // });
      statusBar.backgroundColorByHexString('#886FE8');
      splashScreen.hide();     
      // firebase.auth().onAuthStateChanged(function(user) {
      //   if (user) {
      //     me.nav.setRoot(TabsPage);
      //   } else {
          me.nav.setRoot(LoginPage);
      //   }
      // });

      // // Check if the user is already logged in POSSIBLY OBSOLETE
      // NativeStorage.getItem('data')
      //   .then(function (data) {
      //     //alert("Got tokens" + data);
      //     // user was previously logged in
      //     // alert("In initial, User token: " + data.token);
      //     me.loginProvider.setToken(data.token);
      //     return Promise.all([data, me.loginProvider.getProfile()]);
      //   })
      //   .then(function (results) {

      //     me.loginProvider.setUser(results[1]);

      //     me.nav.setRoot(TabsPage);


      //   })
      //   .catch(function (err) {

      //     // alert("Couldn't get data");
      //     //alert('No user found');
      //     // user not previously logged in
      //     me.nav.setRoot(LoginPage);

      //   });

    }
}
