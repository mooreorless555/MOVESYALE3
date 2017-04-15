import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import firebase from 'firebase';
import 'rxjs/add/operator/map';

import { StatsProvider } from '../providers/stats-provider';

/*
  Generated class for the MovesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MovesProvider {

  public moves: any;

  constructor(public http: Http, public stat: StatsProvider) {
    setTimeout(() => console.log('Hello MovesProvider Provider', "Your moves are: ", this.moves), 1000);
  }


  trackChanges() {
    let me = this;
    const preObject = document.getElementById('moves');
    const dbRefObject = firebase.database().ref().child('moves');
    dbRefObject.on('value', snap => {
      me.moves = snap.val();
        let perc = 0.3;
        console.log(this.stat.counters);
        // if (this.stat.counters.length > 0) this.stat.UpdateCounter(this.stat.counters[0], perc);
      });
  }

  // trackMove() {
  //   const preObject = document.getElementById('moves');
  //       const dbRefObject = firebase.database().ref().child('moves');
  //       dbRefObject.on('value', snap => {
  //         this.moves = snap.val();
  //         if (this.moves.length > 0 && this.stat.counters.length == 0) {  
  //         } else {
  //         let perc = 0.3;
  //         console.log(this.stat.counters);
  //         if (this.stat.counters.length > 0) this.stat.UpdateCounter(this.stat.counters[0], perc);
  //         }
  //       });    
  // }

  deleteMove(move) {

  }

  makeMove(move) {
    var ref = firebase.database().ref().child('moves');
    ref.once("value").then(snap => {
      firebase.database().ref('moves/' + snap.val().length).set({
        "LatLng" : {
          "lat" : move.LatLng.lat,
          "lng" : move.LatLng.lng
        },
        "info" : {
          "capacity" : move.info.capacity,
          "extraInfo" : move.info.extraInfo,
          "hasAlcohol" : move.info.hasAlcohol,
          "location" : move.info.location,
          "name" : move.info.name,
          "hosts": move.info.hosts
        },
        "stats" : {
          "dead" : move.stats.dead,
          "fun" : move.stats.fun,
          "meh" : move.stats.meh,
          "people" : move.stats.people
        }
    });
    });
  }
  

}
