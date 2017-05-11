import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { NativeAudio } from '@ionic-native/native-audio';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import firebase from 'firebase';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { StatsProvider } from '../providers/stats-provider';
import { LocationTracker } from '../providers/location-tracker';
import { LoginProvider, MoveUser } from '../providers/login-provider';

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
  public calling = false;
  public subscription: any;
  public dbRefWatch: firebase.database.Reference;
  public dbRefPeople: firebase.database.Reference;

  public radius = 15;

  constructor(public http: Http, public na: NativeAudio, public af: AngularFire, public stat: StatsProvider, public alertCtrl: AlertController, public lp: LoginProvider, public mUser: MoveUser, public locationTracker: LocationTracker) {
    setTimeout(() => console.log('Hello MovesProvider Provider', "Your moves are: ", this.moves), 1000);
    this.na.preloadSimple('arrive', 'sounds/arrive.mp3');   
  }

  initializeGeofences() {
    this.locationTracker.geofence.removeAll()
      .then((resp) => {
        firebase.database().ref().child('moves').once('value')
          .then(moves => {
            this.na.play('arrive');
            moves.forEach(move => {
              this.locationTracker.setGeofence(move.val(), this.radius);
            })
          })
      })
      .then(() => {
        this.checkTransitions();
      })
  };

  checkTransitions() {
        this.locationTracker.geofence.onTransitionReceived().subscribe(res => {
          // alert(JSON.stringify(res))
          res.forEach(geo => {
            let movekey = geo.id.substring(0, geo.id.length - 5); // CUTS OUT "ENTER" OR "LEAVE"
            if (geo.transitionType == 1) this.addUser(movekey)
            else this.removeUser(movekey)
          })
        })
  }


  trackChanges() {
    let me = this;
    this.stat.cnum = 0;
    if (this.dbRefWatch) this.dbRefWatch.off();
    if (this.dbRefPeople) this.dbRefPeople.off();
    this.dbRefObject = firebase.database().ref().child('moves');
    me.moves = this.af.database.list('/moves');
    this.subscription = me.moves.subscribe(obj => {
      console.log("Look, we have" + obj);
    }).unsubscribe();
      this.stat.cnum = 0;
    return this.dbRefObject.once('value', snap => {
      this.movenum = snap.numChildren();
      setTimeout(() => snap.forEach(move => {
        this.putBars(move.val());
        return false;
      }),800)
      console.log(this.stat.cnum, this.movenum);
      this.initializeGeofences();
    });
  }

  addUser(movekey) {
    var user = this.mUser.getFB();
    var userInfo = {
      id: user.id,
      name: user.name,
      move: movekey 
    }

    var ref = firebase.database().ref('moves/')
    ref
      .orderByKey()
      .equalTo(movekey)
      .once('child_added', snap => {
        snap.ref.child('users').child(user.id).update(userInfo)
      })
  }

  addRando(movekey) {
    var user = {uid: Math.random() * 10 + '', displayName: "Rando"}
    var userInfo = {
      name: user.displayName,
      move: movekey
    } 

    var ref = firebase.database().ref('moves/')
    ref
      .orderByKey()
      .equalTo(movekey)
      .once('child_added', snap => {
        snap.ref.child('users').child(user.uid).update(userInfo)
      })
  }    

  removeUser(movekey) {
    var user = this.mUser.getFB()
    var ref = firebase.database().ref('moves/')
    ref
      .orderByKey()
      .equalTo(movekey)
      .once('child_added', snap => {
        snap.ref.child('users').child(user.id).remove();
      })
  }

  trackStatChanges(move, funstatbar, mehstatbar, deadstatbar, progbar) {
    let capacity = move.info.capacity;
    this.dbRefWatch = firebase.database().ref().child('moves/' + move.key);
    this.dbRefPeople = firebase.database().ref().child('moves/' + move.key).child('users');

    this.dbRefPeople.on('value', snap => {
      let move = snap.val()
      console.log(move);
      let value = snap.numChildren() / capacity;
      progbar.animate(value);
    })
    

    this.dbRefWatch.on('value', snap => {
      let move = snap.val();
      let capacity = move.info.capacity;
      var funbarperc;
      var mehbarperc;
      var deadbarperc;
      funbarperc = move.stats.fun / capacity;
      mehbarperc = move.stats.meh / capacity;
      deadbarperc = move.stats.dead / capacity;

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
        console.log('Container for ' + move.info.name + 'is empty. Adding.');
        const dbRefPpl = firebase.database().ref().child('moves/' + move.key).child('users');

        dbRefPpl.once('value', snap => {
          this.stat.CreatePeopleCounter(move.key, snap.numChildren() / move.info.capacity);
        })
  }

  incStat(move, type) {
    let value = 1;
    console.log('INCREASE')
    if (arguments[2]) value = arguments[2];
    firebase.database().ref()
      .orderByChild('moves')
      .equalTo(move.key)
      .once('value', snap => snap.ref.child('stats').child('fun').update(3));
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
            firebase.database().ref().child('moves/' + move.key).remove().then(() => {
              this.stat.cnum--;
              console.log("All done.");
              this.trackChanges();
            }
            );
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
    this.addUser(newKey);
    // let newKeyUser = firebase.database().ref('moves/' + newKey).child('users').push({
    //   "uid": user.uid,
    //   "name": user.displayName
    // }).key;
    // firebase.database().ref().child('moves/' + newKey + '/users/' + newKeyUser).update({ key: newKeyUser });




  }


}
