import { Component } 	from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } 	from '../home/home';
import { MapPage } 		from '../map/map';
import { MakePage } 	from '../make/make';
import { ProfilePage } 	from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = MapPage;
  tab3Root: any = MakePage;
  tab4Root: any = ProfilePage;

  constructor(public navCtrl: NavController) {

  }
  
  goToMake() {
    console.log('Make!');
    this.navCtrl.push(MakePage);
  }
}
