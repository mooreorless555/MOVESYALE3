import { Component, ViewChildren } from '@angular/core';
import { NavController } from 'ionic-angular';

// import { NativeStorage } from 'ionic-native';

import { MakePage } from '../make/make';
import { StatsPage } from '../stats/stats';
import { ProfilePage } from '../profile/profile';
import { MapPage } from '../map/map';

import { MovesService } from '../services/MovesService';
import { StatsProvider } from '../../providers/stats-provider';
import { System, Globals } from '../functions/functions';
import { LoginProvider } from '../../providers/login-provider';
import { LocationTracker } from '../../providers/location-tracker';

declare var ProgressBar: any;
declare var $: any;
declare var velocity: any;
declare var marquee: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [System, Globals, StatsProvider]
})

export class HomePage {


  /* Gathers all references to elements labeled 
  'container' for the progress bars (people counters) */
  @ViewChildren('container') container: any;
  moves;

  /* Lists all the moves after the page has fully loaded. 
  This is to allow @ViewChildren to work properly. */
  ngAfterViewInit() {
    this.stat.ResetCounters();
    if (this.globals.debugflag) {
      this.listMoves_1();
    } else {
      this.listMoves();
    }
    this.start();

  }

  /* Upon any change, will update the progress bars. */
  ngAfterViewChecked() {

    if (this.container.toArray().length > 0) {
      if (this.system.checked == 0) {
        if (this.stat.counters) {
          if (this.stat.counters.length > this.moves.length) {
            this.stat.ResetCounters();
            this.system.checked = 0;
          }
        }

        this.system.checked = 1;
        let moves = this.moves;
        setTimeout(() => {
          let containers = this.container.toArray();
          for (var i = 0; i < containers.length; i++) {
            this.stat.CreatePeopleCounter(containers[i]);
          }
        }, 700);

        console.log('Your counters are: ', this.stat.counters);

        setTimeout(() => {
          try {
            for (var i = 0; i < this.moves.length; i++) {
              let counters = this.stat.counters;
              let perc = moves[i].stats.people / moves[i].info.capacity;
              this.stat.UpdateCounter(counters[i], perc);
            }
          } catch (err) {
            this.system.showNotification('Fetching...', 500, 'info');
          }
        }, 2000);
      }



    }


  }

  // ngAfterViewChecked() {
  //   console.log(this.container);
  //   setTimeout(() => {
  //         let containers = this.container.toArray();
  //         if (this.stat.counters.length <= 0) {
  //           for (var i = 0; i < containers.length; i++) {
  //             this.stat.CreatePeopleCounter(containers[i]);
  //           }
  //         }

  //         for (var i = 0; i < this.stat.counters.length; i++) {
  //           let counters = this.stat.counters;
  //           let perc = this.moves[i].stats.people / this.moves[i].info.capacity;
  //           this.stat.UpdateCounter(counters[i], perc);
  //         }
  //   }, 5000);
  // }

  constructor(public navCtrl: NavController, public system: System, public loginProvider: LoginProvider, public locationTracker: LocationTracker, public globals: Globals, public stat: StatsProvider, public movesService: MovesService) {
  }

  /* GPS Tracking */
  start() {
    this.system.showNotification("Tracking started.", 1000);
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
      moves: this.moves
    });
  }



  listMoves_1() {
    this.movesService.getMoves_old()
      .subscribe((data) => {
        this.moves = data;
        this.moves.sort(this.system.sortDescending);
        this.system.moves = this.moves;
        console.log(this.moves);
        // this.system.getFeedbackScreen(this.moves[0]);
      },
      (err) => {
        console.log(err);
      },
      () => {
        console.log('Got Moves');
        this.animateMoves();
      }
      );
    this.clearIntervals();
  }

  listMoves() {
    var me = this;

    me.movesService.getMoves()
      .then((data) => {
        me.movesService.setMoves(data);
        me.moves = data;
        this.animateMoves();
      }, (err) => {
        alert("Couldn't get moves " + err);
      })
      this.clearIntervals();
  }


  /* Refresh list of moves event. */
  refreshMoves(refresher) {
    this.stat.ResetCounters();
    this.clearIntervals();
    this.system.showNotification('Refreshing...', 500, 'loading');
    if (this.globals.debugflag) {
      this.movesService.getMoves_old()
        .subscribe((data) => {
          this.moves = data;
          this.moves.sort(this.system.sortDescending);
          this.system.moves = this.moves;
          console.log(this.moves);
          // this.system.getFeedbackScreen(this.moves[0]);
        },
        (err) => {
          console.log(err);
          this.system.showNotification("Couldn't get moves: " + err, 5000, 'error');
          refresher.complete();
          this.moves = undefined;
          this.system.checked = 1;
        },
        () => {
          console.log('Got Moves');
          this.system.showNotification('Done!', 1000, 'success');
          $('#indivMove').velocity('transition.slideUpIn', { stagger: 800 });
          refresher.complete();
          this.system.checked = 0;
        }
        );
    } else {
      var me = this;

      me.movesService.getMoves()
        .then((data) => {
          me.movesService.setMoves(data);
          me.moves = data;
          $('#indivMove').velocity('transition.slideUpIn', { stagger: 800 });
          this.system.showNotification('Done!', 1000, 'success');
          refresher.complete();
          this.system.checked = 0;
        }, (err) => {
          this.system.showNotification("Couldn't get moves: " + err, 5000, 'error');
          refresher.complete();
          this.moves = undefined;
          this.system.checked = 1;
        })
    }
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

  clearIntervals() {
    if (this.system.stat_updates) {
      clearInterval(this.system.stat_updates);
      console.log('Interval cleared!');
    } else {
      console.log('No interval to clear.', this.system.stat_updates);
    }
  }
}