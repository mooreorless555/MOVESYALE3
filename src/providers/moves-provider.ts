import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import firebase from 'firebase';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { StatsProvider } from '../providers/stats-provider';

import { AlertController } from 'ionic-angular';

declare var $: any;

/*
  Generated class for the MovesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MovesProvider {

  public tempmoves: any;
  public moves: FirebaseListObservable<any>;
  public dbRefObject: firebase.database.Reference;
  public movenum = 0;

  constructor(public http: Http, public af: AngularFire, public stat: StatsProvider, public alertCtrl: AlertController) {
    setTimeout(() => console.log('Hello MovesProvider Provider', "Your moves are: ", this.moves), 1000);
  }


  trackChanges() {
    console.log('Hi...');
    let me = this;
    this.stat.cnum = 0;
    this.dbRefObject = firebase.database().ref().child('moves');
    return this.dbRefObject.once('value', snap => {
      me.moves = this.af.database.list('/moves');
      this.movenum = snap.numChildren();
      console.log(this.movenum);
    });
  }

  trackStatChanges(move, funstatbar, mehstatbar, deadstatbar, progbar) {
    const dbRef = firebase.database().ref().child('moves/' + move.key);

    dbRef.on('value', snap => {
      let move = snap.val();
      let value = move.stats.people/move.info.capacity;
      let capacity = move.info.capacity;
      var funbarperc;
      var mehbarperc;
      var deadbarperc;
      funbarperc = move.stats.fun/capacity;
      mehbarperc = move.stats.meh/capacity;
      deadbarperc = move.stats.dead/capacity;

      progbar.animate(value);

      if (funbarperc > 0) {
        this.stat.UpdateCounter(funstatbar, funbarperc);
      } else {
        this.stat.UpdateCounter(funstatbar, 0.003);
      }
      if (mehbarperc > 0) {
        this.stat.UpdateCounter(mehstatbar, mehbarperc);
      } else {
        this.stat.UpdateCounter(mehstatbar, 0.003);
      }
      if (deadbarperc > 0) {
        this.stat.UpdateCounter(deadstatbar, deadbarperc);
      } else {
        this.stat.UpdateCounter(deadstatbar, 0.003);
      }  
    });
  }


  stopTrackingChanges() {
    this.dbRefObject.off();
  }

  putBars(move) {
    if (this.stat.cnum < this.movenum) {
      this.stat.CreatePeopleCounter(move.key, move.stats.people/move.info.capacity);
    }
  }

  // appendMove(move) {
  //   let part1 = "<ion-item id=" + "SOME_KEY" + "class='moveslist' no-lines (click)='checkStats(move)' (press)='system.moveOptionsScreen(move)'><ion-icon item-right><div id=" + "SOME_KEY" + "class='container' #container></div>";
  //   let part2 = "</ion-icon><span><ion-icon name='arrow-dropright-circle' class='ratingdot' [ngClass]='{ 'fun-border': totalRatings(move) == 1, 'meh-border': totalRatings(move) == 2, 'dead-border': totalRatings(move) == 3 }'></ion-icon>";
  //   let part3 = "<h1 id='moveName' class='cutoff' style='display: inline'>" + move.info.name + "</h1></span>";
  //   let part4 = '<p id="extraInfo" class="extra-info-text item-description">' + move.info.extraInfo + '</p>';
  //   let part5 = '<p class="host-text"><i>Hosted by" + ' + move.info.hosts[0] + '</i></p></ion-item>';
  //   let total = part1 + part2 + part3 + part4 + part5;
  //   $('#indivMove').append(total);
  // }

  // getMove(myKey) {
  //   firebase.database().ref().child('moves').orderByChild("key").equalTo(myKey);
  // }

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
    let confirm = this.alertCtrl.create({
      message: 'Are you sure want to delete "' + move.info.name + '"?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: data => {
            firebase.database().ref().child('moves/' + move.key).remove().then(() => console.log("All done."));
          }
        }
      ]
    });
    confirm.present();
  }

  makeMove(move) {
    let newMove = firebase.database().ref().child('moves');
    let newKey = newMove.push({
      "key": "",
      "LatLng": {
        "lat": move.LatLng.lat,
        "lng": move.LatLng.lng
      },
      "info": {
        "capacity": move.info.capacity,
        "extraInfo": move.info.extraInfo,
        "hasAlcohol": move.info.hasAlcohol,
        "location": move.info.location,
        "name": move.info.name,
        "hosts": move.info.hosts
      },
      "stats": {
        "dead": move.stats.dead,
        "fun": move.stats.fun,
        "meh": move.stats.meh,
        "people": move.stats.people
      }
    }).key;

    firebase.database().ref().child('moves/' + newKey).update({ key: newKey });





  }


}
