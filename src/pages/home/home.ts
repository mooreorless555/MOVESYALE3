import { Component, NgZone, trigger, style, animate, transition } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { NativeStorage } from 'ionic-native';

import { MakePage } from '../make/make';
import { StatsPage } from '../stats/stats';
import { ProfilePage } from '../profile/profile';
import { MapPage } from '../map/map';
import { StatsProvider } from '../../providers/stats-provider';
import { LoginProvider, MoveUser } from '../../providers/login-provider';
import { MovesProvider } from '../../providers/moves-provider';
import { System, Globals } from '../functions/functions';

import { LocationTracker } from '../../providers/location-tracker';

declare var ProgressBar: any;
declare var $: any;
declare var velocity: any;
declare var marquee: any;
declare var toastr: any;
declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
  trigger('fadeInOut', [
    transition(':enter', [   // :enter is alias to 'void => *'
      style({opacity:0}),
      animate(200, style({opacity:0})), 
      animate(500, style({opacity:1})) 
    ]),
    transition(':leave', [   // :leave is alias to '* => void'
      animate(500, style({opacity:0})) 
    ])
  ])
],
  providers: [System, Globals, LoginProvider, StatsProvider, MovesProvider]
})

export class HomePage {


  /* Gathers all references to elements labeled 
  'container' for the progress bars (people counters) */
  // @ViewChildren('container') container: any;
  // public moves = [];
  sMoveSummary = "Getting data...";
  // counterbar: any;

  /* Lists all the moves after the page has fully loaded. 
  This is to allow @ViewChildren to work properly. */
  ngAfterViewInit() {
    this.start();
    this.introducePage();
  }

  constructor(public navCtrl: NavController, 
              public zone: NgZone, 
              public system: System, 
              public loginProvider: LoginProvider, 
              public mUser: MoveUser,
              public locationTracker: LocationTracker, 
              public globals: Globals, 
              public stat: StatsProvider, 
              public mp: MovesProvider) {
    this.mp.trackChanges().then(() => {
      console.log('AWESOME!');
    this.mp.stopTrackingChanges()}).catch((error) =>
      this.system.showNotification('Yikes! Something went wrong. ERROR: ' + error, 3000, 'error'));

            this.zone.run(() => {
                // Update the fields of the form, and Angular will update
                // the view for you.
                console.log("A CHANGE!");
            });


            // this.zone.run(() => this.counterbar = "YO");
}


  /* GPS Tracking */
  start() {
    this.system.showNotification("Locating...", 400);
    this.locationTracker.startTracking();
  }

  stop() {
    this.system.showNotification("Tracking stopped.", 1000);
    this.locationTracker.stopTracking();
  }

  goToProfile() {
    this.navCtrl.push(ProfilePage);
  }

  goToMake() {
    console.log('Make!');
    this.navCtrl.push(MakePage);
  }

  goToMap() {
    this.navCtrl.push(MapPage, {
      // moves: this.moves;
    });
  }

  moveSummary() {
    let nPeople = 0;
    let nMoves = 0;
    let nRatings = 0;
    // for (var i = 0; i < this.mp.moves.length; i++) {
    //   nRatings += this.mp.moves[i].stats.fun + this.mp.moves[i].stats.meh + this.mp.moves[i].stats.dead;
    //   nMoves = i+1;
    //   nPeople += this.mp.moves[i].stats.people;
    // }

    let sSummary = nPeople + " PEOPLE at " + nMoves + " MOVES with a total of " + nRatings + " RATINGS.";
    return sSummary;
  }


  /* Refresh list of moves event. */
  refreshMoves(refresher) {
    this.system.showNotification('Refreshing...', 500, 'loading');
    this.mp.trackChanges()
    .then(() => {
      refresher.complete();
      this.system.showNotification("Done!", 800, 'success');
      this.mp.stopTrackingChanges()})
    .catch((error) => {
      this.system.showNotification('Yikes! Something went wrong. ERROR: ' + error, 3000, 'error');
      this.mp.stopTrackingChanges();
    });
  }


  /* Go to the Stats page */
  checkStats(move, key) {
    this.mp.stopTrackingChanges();
    this.navCtrl.push(StatsPage, {
      firstPassed: move,
      movekey: key
    }
    );
    // this.system.showNotification("LOL", 3000, 'success');
  }

  totalRatings(move) {
    let nFun = move.stats.fun;
    let nMeh = move.stats.meh;
    let nDead = move.stats.dead;
    let nMax = Math.max(nFun, nMeh, nDead);

    if (nMax == nFun) return 1;
    if (nMax == nMeh) return 2;
    if (nMax == nDead) return 3;
  }

  animateMoves() {
    $("*[id*=indivMove]").velocity('transition.slideUpIn', { stagger: 200 });
  }

  introducePage() {
    $("*[id*=day]").velocity('transition.slideUpIn', { duration: 800 });
    $("*[id*=date]").velocity('transition.slideUpIn', { duration: 900 });
    $("*[id*=infobord]").velocity('transition.slideDownIn', { duration: 1100 });
  }

  clearIntervals() {
    if (this.system.stat_updates) {
      clearInterval(this.system.stat_updates);
      console.log('Interval cleared!');
    } else {
      console.log('No interval to clear.', this.system.stat_updates);
    }
  }
}