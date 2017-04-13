import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import firebase from 'firebase';

// import { MovesService } from '../pages/services/MovesService';
import { LoginProvider } from '../providers/login-provider';


// import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  // providers: [System, Globals]
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: LoginPage;

  constructor(public platform: Platform, public loginProvider: LoginProvider) {
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
      StatusBar.backgroundColorByHexString('#886FE8');

      // this.zone = new NgZone({});
      // const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      //   this.zone.run( () => {
      //     if (!user) {
      //       this.nav.setRoot(LoginPage);
      //       unsubscribe();
      //     } else { 
      //       this.nav.setRoot(HomePage); 
      //       unsubscribe();
      //     }
      //   });     
      // });
      console.log("Hello?");

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



      //   })
      //   .catch(function (err) {

      //     // alert("Couldn't get data");
      //     //alert('No user found');
      //     // user not previously logged in
          this.nav.setRoot(LoginPage);

      //   });

    });
  }
}
