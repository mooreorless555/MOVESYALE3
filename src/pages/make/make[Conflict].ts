import { Component } from '@angular/core';

import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

import { System, Globals } from '../functions/functions';
import { LocationTracker } from '../../providers/location-tracker';
import { StatsProvider } from '../../providers/stats-provider';
import { LoginProvider } from '../../providers/login-provider';
import { MovesProvider } from '../../providers/moves-provider';

declare var $: any;
declare var velocity: any;

@Component({
  selector: 'page-make',
  templateUrl: 'make.html',
  providers:[MovesProvider, LoginProvider, System, Globals, StatsProvider]
})

export class MakePage {
  public hello;


  /* Move Object */
  public move   = {
      info        : {
        name      : "",
        hosts      : [],
        location  : "",
        capacity  : 30,
        hasAlcohol: false,
        extraInfo : ""
      },
      
      LatLng      : {
        lat       : 0,
        lng       : 0
      },

      stats       : {
        people    : 1,
        fun       : 0,
        meh       : 0,
        dead      : 0
      }
  }

ngAfterViewInit() {
      this.introducePage();
}
 /* Form submission checking */
  logForm() {
    this.move.info.name = this.move.info.name.trim();
    this.move.info.location = this.move.info.location.trim();
    console.log(this.move.info.name);
    if (this.move.info.name == "") {
      this.system.showNotification("You need to give your Move a name.", 3000, 'error');
    } else if (this.allspaces(this.move.info.name)) {
      this.system.showNotification("This is an invalid name.", 3000);
    } else if (this.move.info.name.length < 3) {
      this.system.showNotification("The name needs to be at least 3 characters long.", 3000, 'error');
    } else if (this.move.info.capacity < this.globals.config.min) {
      this.system.showNotification("The minimum capacity is " + this.globals.config.min + " people.", 3000, 'error');
      this.move.info.capacity = this.globals.config.min;
    } else if (this.move.info.capacity > this.globals.config.max) {
      this.system.showNotification("The maximum capacity is " + this.globals.config.max + " people.", 3000, 'error');
      this.move.info.capacity = this.globals.config.max;     
    } else {
      this.confirmMove();
      console.log(this.move);
    }
  }

  allspaces(string) {
    var numspace = 0;
    for (var i = 0; i < string.length; i++) {
      if (string[i] == ' ' || string[i] == '.') {
        numspace++;
      }
    }

    if (numspace == string.length) return true;
    return false;
  }

  resetFields(move) {
    move.info.name = '';
    move.info.hasAlcohol = false;
    move.info.extraInfo = '';
  }




  constructor(public navCtrl: NavController, public mp: MovesProvider, public loginProvider: LoginProvider, public locationTracker: LocationTracker, public toastCtrl: ToastController, public alertCtrl: AlertController, public system: System, private globals: Globals) {
    let messages = [
      "Please enter Move here.", 
      "What's the move?", 
      "This'll be fun.",
      "What you got for us?"
    ];

    this.hello = messages[Math.floor(Math.random() * messages.length)];

  }

    confirmMove() {
      let confirm = this.alertCtrl.create({
            message: '"' + this.move.info.name + '" will go live at your current location. Do you confirm this?',
    buttons: [
      {
        text: 'Wait, go back',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }},
        {
        text: 'GO LIVE!',
        handler: data => {
          this.move.stats.people = Math.floor(Math.random() * this.move.info.capacity);
          this.move.stats.fun = Math.floor(Math.random() * this.move.info.capacity);
          this.move.stats.meh = Math.floor(Math.random() * this.move.info.capacity);
          this.move.stats.dead = Math.floor(Math.random() * this.move.info.capacity);
          this.move.LatLng.lat = this.locationTracker.lat;
          this.move.LatLng.lng = this.locationTracker.lng;
          let host = this.loginProvider.getUser();
          if (!host) {
            this.move.info.hosts.push("Test Man");
          } else {
            this.move.info.hosts.push(host.displayName);
          }


          this.mp.makeMove(this.move);
          this.system.startLoading("Adding your move to the map.", 1000);
          setTimeout(() => {
            this.system.showNotification("Your move is now on the map. Check it out!", 1000);
            this.navCtrl.setRoot(TabsPage);
            console.log('Confirmed.');
            console.log("Move creation success. Sending out object data for database storage."); 
            this.resetFields(this.move);           
          }, 1000);

        }}]
        });
          confirm.present();
    }

    alcWarning() {
     let warning = this.toastCtrl.create({
      message: "You agree that you must be of 21 years or older to drink alcohol in the state of Connecticut.",
      duration: 5000
    });

     this.globals.config.displayMsg = !(this.globals.config.displayMsg);
     if (this.globals.config.displayMsg) {
       warning.present();
     }
   }

    introducePage() {
      $("ion-item").velocity('transition.slideUpIn', { stagger: 130 });
      setTimeout(() => {$('#submitBtn').removeClass('hide').velocity('transition.shrinkIn', { duration: 100});}, 900);
    }

}
