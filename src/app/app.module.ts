import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { StatsPage } from '../pages/stats/stats';
import { MakePage } from '../pages/make/make';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { MapPage } from '../pages/map/map';
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";
import { Facebook } from '@ionic-native/facebook';
import { LocationTracker } from '../providers/location-tracker';
import { LoginProvider, MoveUser } from '../providers/login-provider';
import { MovesProvider } from '../providers/moves-provider';
import { StatsProvider } from '../providers/stats-provider';
import { AngularFireModule } from 'angularfire2';
import { NativeAudio } from '@ionic-native/native-audio';

import { BackgroundMode } from '@ionic-native/background-mode';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import { Geofence } from '@ionic-native/geofence';
import 'rxjs/add/operator/map';

export const firebaseConfig = {
      apiKey: "AIzaSyANmdr_oNcjak8eVKUI7esAoyk4mtWKD-M",
      authDomain: "moves-ad1b4.firebaseapp.com",
      databaseURL: "https://moves-ad1b4.firebaseio.com",
      projectId: "moves-ad1b4",
      storageBucket: "moves-ad1b4.appspot.com",
      messagingSenderId: "583373480587"
    };

@NgModule({
  declarations: [
    MyApp,
    StatsPage,
    MakePage,
    HomePage,
    LoginPage,
    ProfilePage,
    TabsPage,
    MapPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out'
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    BrowserModule,  // New in ionic 3
    BrowserAnimationsModule,
    HttpModule  // New in ionic 3
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StatsPage,
    MakePage,
    HomePage,
    LoginPage,
    ProfilePage,
    TabsPage,
    MapPage
  ],
  providers: [LocationTracker, LoginProvider, MoveUser, MovesProvider, StatsProvider, BackgroundMode, BackgroundGeolocation, Geolocation, Geofence, NativeAudio, SplashScreen, StatusBar, Facebook]
})
export class AppModule {}
