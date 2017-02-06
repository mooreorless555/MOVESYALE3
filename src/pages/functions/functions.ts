/* This is the main functions file. It contains functions that
can control the database. */



import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { MovesService } from '../services/MovesService';
import { StatsProvider } from '../../providers/stats-provider';

declare var ProgressBar: any;

@Injectable()
export class System {

  public checked = 0;
  public moves = [];

  // public progbars = new Array();

  public currentdate = this.showDate();
  public currentday = this.showDay();

  public stat_updates = null;

  constructor(public toastCtrl: ToastController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public stat: StatsProvider, private movesService: MovesService) {

  }

  showNotification(msg, duration) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: duration
    });
    toast.present();
  }    

startLoading(msg, duration) {
  let loader = this.loadingCtrl.create({
    spinner: 'hide',
    content: '<div class="centertext centerme"><img class="custom-spinner" src="assets/img/test_stroke_animated.svg"/><br>' + msg + '</div>',
    duration: duration
  });
  loader.present();
}

  moveOptionsScreen(move) {
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
            this.deleteMove(move);
          }
        }
      ]
    });
    
    confirm.present();
  }

  
  // listMoves() {
  //   this.movesService.getMoves().then((data) => {

  //     this.moves = data;

  //   }, (err) => {

  //     console.log(err);

  //   });
  // }
  

deleteMove(move) {
    this.movesService.deleteMove(move).then((result) => {

      console.log("Deleted")

    }, (err) => {

      console.log(err);

    });


    this.startLoading('Deleting move, standby...', 1000);
    setTimeout(() => {
        this.checked = 0;
        this.stat.ResetCounters();    
        this.showNotification('Move has been deleted.', 1000);
    }, 1000);    
  }

  // updateProgbars() {
  //   console.log("Let's update.");
  //   if (this.moves[0]) {
  //     for (var i = 0; i < this.moves.length; i++) {
  //      var value = this.moves[i].stats.people/this.moves[i].info.capacity;
  //      if (value > 1) value = 1;
  //      this.progbars[i].animate(value);        
  //     }
  //   }
  // }

  sortDescending(data_A, data_B) {
    return ((data_B.stats.people/data_B.info.capacity) - (data_A.stats.people/data_A.info.capacity));
  }

  showDay() {
    var d = new Date();  
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var message = days[d.getDay()] + " " + this.getTimeOfDay()
  return message;
  }

  showDate() {
    var d = new Date();
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var message = months[d.getMonth()] + " " + this.getDateRight() + ", " + d.getFullYear();
    return message;
  }

  getDateRight() {
    var d = new Date();
    var date = d.getDate().toString();
    var result;
    if (date.endsWith('1')) {
      result = date + "st";
    } else if (date.endsWith('2')) {
      result = date + "nd";
    } else if (date.endsWith('3')) {
      result = date + "rd";
    } else {
      result = date + "th";
    }
    return result;
  }

  getTimeOfDay() {
    var d = new Date();
    var time = d.getHours();
    var result;
    if (time >= 0 && time < 12) {
      result = "morning";
    } else if (time >= 12 && time < 18) {
      result = "afternoon";
    } else if (time >= 18 && time < 21) {
      result = "evening";
    } else {
      result = "night";
    }
    return result;
  }

}

  @Injectable()
  export class Globals {

    public config = {
      min: 30,
      max: 10000,
      displayMsg: false
    };

    public debugflag = true;

    // public rooms = {
    //   landing.
    // }
  }