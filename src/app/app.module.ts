import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
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
import { LoginProvider } from '../providers/login-provider';
import { MovesProvider } from '../providers/moves-provider';
import 'rxjs/add/operator/map';

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
    BrowserModule,  // New in ionic 3
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
  providers: [LocationTracker, LoginProvider, MovesProvider, SplashScreen, StatusBar, Facebook]
})
export class AppModule {}
