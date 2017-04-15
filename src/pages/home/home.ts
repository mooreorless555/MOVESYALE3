import { Component, ViewChildren } from '@angular/core';
import { NavController } from 'ionic-angular';
import firebase from 'firebase';

// import { NativeStorage } from 'ionic-native';

import { MakePage } from '../make/make';
import { StatsPage } from '../stats/stats';
import { ProfilePage } from '../profile/profile';
import { MapPage } from '../map/map';
import { StatsProvider } from '../../providers/stats-provider';
import { LoginProvider } from '../../providers/login-provider';
import { MovesProvider } from '../../providers/moves-provider';
import { System, Globals } from '../functions/functions';
import { LocationTracker } from '../../providers/location-tracker';

declare var ProgressBar: any;
declare var $: any;
declare var velocity: any;
declare var marquee: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [System, Globals, LoginProvider, StatsProvider, MovesProvider]
})

export class HomePage {


  /* Gathers all references to elements labeled 
  'container' for the progress bars (people counters) */
  @ViewChildren('container') container: any;
  // public moves = [];
  thing: any;

  sMoveSummary = "Getting data...";

  /* Lists all the moves after the page has fully loaded. 
  This is to allow @ViewChildren to work properly. */
  ngAfterViewInit() {
    let containers;
      setTimeout(() => {
        this.mp.trackChanges()}, 600);
        setTimeout(() => containers = this.container.toArray(), 800);
      setTimeout(() => {for (var i = 0; i < this.mp.moves.length; i++) {
              this.stat.CreatePeopleCounter(containers[i]);
            }
      }, 1200);
    this.listMoves();
    this.start();
    this.introducePage();
  }

  constructor(public navCtrl: NavController, public system: System, public loginProvider: LoginProvider, public locationTracker: LocationTracker, public globals: Globals, public stat: StatsProvider, public mp: MovesProvider) {
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
    for (var i = 0; i < this.mp.moves.length; i++) {
      nRatings += this.mp.moves[i].stats.fun + this.mp.moves[i].stats.meh + this.mp.moves[i].stats.dead;
      nMoves = i+1;
      nPeople += this.mp.moves[i].stats.people;
    }

    let sSummary = nPeople + " PEOPLE at " + nMoves + " MOVES with a total of " + nRatings + " RATINGS.";
    return sSummary;
  }


  listMoves() {

  }


  /* Refresh list of moves event. */
  refreshMoves(refresher) {
    this.stat.ResetCounters();
    this.clearIntervals();
    this.system.showNotification('Refreshing...', 500, 'loading');
    if (this.globals.debugflag) {
      // this.movesService.getMoves_old()
      //   .subscribe((data) => {
      //     this.moves = data;
      //     this.moves.sort(this.system.sortDescending);
      //     this.system.moves = this.moves;
      //     console.log(this.moves);
      //     // this.system.getFeedbackScreen(this.moves[0]);
      //   },
      //   (err) => {
      //     console.log(err);
      //     this.system.showNotification("Couldn't get moves: " + err, 5000, 'error');
      //     refresher.complete();
      //     this.moves = undefined;
      //     this.system.checked = 1;
      //     this.sMoveSummary = "Data unavailable.";
      //   },
      //   () => {
      //     console.log('Got Moves');
      //     this.system.showNotification('Done!', 1000, 'success');
      //     $('#indivMove').velocity('transition.slideUpIn', { stagger: 800 });
      //     refresher.complete();
      //     this.system.checked = 0;
      //   }
      //   );
    } else {
      // var me = this;

      // me.movesService.getMoves()
      //   .then((data) => {
      //     me.movesService.setMoves(data);
      //     me.moves = data;
      //     $('#indivMove').velocity('transition.slideUpIn', { stagger: 800 });
      //     this.system.showNotification('Done!', 1000, 'success');
      //     refresher.complete();
      //     this.system.checked = 0;
      //   }, (err) => {
      //     this.system.showNotification("Couldn't get moves: " + err, 5000, 'error');
      //     refresher.complete();
      //     this.moves = undefined;
      //     this.system.checked = 1;
      //     this.sMoveSummary = "Data unavailable.";
      //   })
    }
    refresher.complete();
  }

  /* Go to the Stats page */
  checkStats(move) {
    this.navCtrl.push(StatsPage, {
      firstPassed: move
    }
    );
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