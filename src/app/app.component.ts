import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";
import firebase from 'firebase';

// import { MovesService } from '../pages/services/MovesService';
import { LoginProvider } from '../providers/login-provider';

// import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
// import { HomePage } from '../pages/home/home';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  // providers: [System, Globals]
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: LoginPage;

  constructor(public platform: Platform, public loginProvider: LoginProvider, statusBar: StatusBar, splashScreen: SplashScreen) {
    // var me = this;
    
    firebase.initializeApp({
      apiKey: "AIzaSyANmdr_oNcjak8eVKUI7esAoyk4mtWKD-M",
      authDomain: "moves-ad1b4.firebaseapp.com",
      databaseURL: "https://moves-ad1b4.firebaseio.com",
      projectId: "moves-ad1b4",
      storageBucket: "moves-ad1b4.appspot.com",
      messagingSenderId: "583373480587"
    });

    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault(); // use provided instances instead, dependency injection rules!
      splashScreen.hide();
      statusBar.backgroundColorByHexString('#886FE8');
      this.nav.setRoot(LoginPage);
  

      //   });

    });
  }
}
