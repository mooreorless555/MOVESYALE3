import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatsPage } from '../pages/stats/stats';
import { MakePage } from '../pages/make/make';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { MapPage } from '../pages/map/map';

import { LocationTracker } from '../providers/location-tracker';
import { LoginProvider } from '../providers/login-provider';
import { MovesService } from '../pages/services/MovesService';

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
    })
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
  providers: [LocationTracker, LoginProvider, MovesService]
})
export class AppModule {}
