import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { LoginProvider, MoveUser } from '../providers/login-provider';
import { SplashScreen } from "@ionic-native/splash-screen";
import { Geofence } from "@ionic-native/geofence";
import { StatusBar } from "@ionic-native/status-bar";
// import { TabsPage } from '../pages/tabs/tabs';
import { NativeAudio } from '@ionic-native/native-audio';
import { LoginPage } from '../pages/login/login';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  // providers: [System, Globals]
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: LoginPage;

  constructor(public platform: Platform, public na: NativeAudio, public geofence: Geofence, public loginProvider: LoginProvider, public mUser: MoveUser, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    // firebase.initializeApp({
    //   apiKey: "AIzaSyANmdr_oNcjak8eVKUI7esAoyk4mtWKD-M",
    //   authDomain: "moves-ad1b4.firebaseapp.com",
    //   databaseURL: "https://moves-ad1b4.firebaseio.com",
    //   projectId: "moves-ad1b4",
    //   storageBucket: "moves-ad1b4.appspot.com",
    //   messagingSenderId: "583373480587"
    // });

 platform.ready().then(() => {
      statusBar.backgroundColorByHexString('#886FE8');
      splashScreen.hide();  
      // firebase.auth().onAuthStateChanged(function(user) {
      //   if (user) {
      //     me.nav.setRoot(TabsPage);
      //   } else {
          this.nav.setRoot(LoginPage);
      //   }
    });

  }
}
