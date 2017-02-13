/* This is the main functions file. It contains functions that
can control the database. */



import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { MovesService } from '../services/MovesService';
import { StatsProvider } from '../../providers/stats-provider';
import { LoginProvider } from '../../providers/login-provider';
import swal from 'sweetalert2';

declare var toastr: any;
declare var $: any;
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

  /**
   * Displays a toast notification at the bottom of the screen.
   * @param {string} msg Message to be displayed in the notification.
   * @param {number} duration Number of milliseconds (ms) for the notification to be displayed.
   * @param {string} type Optional argument, change type of notification to be displayed: 'success', 'error'
   */
  showNotification(msg, duration, type?: string) {
    // let toast = this.toastCtrl.create({
    //   message: msg,
    //   duration: duration
    // });
    // toast.present();

    var bProgressBar = false;
    if (type == 'loading') {
      bProgressBar = true;
    }

    toastr.options = {
      "closeButton": false,
      "debug": false,
      "newestOnTop": true,
      "progressBar": bProgressBar,
      "positionClass": "toast-bottom-center",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "100",
      "hideDuration": "100",
      "timeOut": duration,
      "extendedTimeOut": "0",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };
    if (type === undefined) {
      toastr.info(msg);
    } else if (type == 'success') {
      toastr.success(msg);
    } else if (type == 'error') {
      toastr.error(msg);
    } else {
      toastr.info(msg);
    }
  }

  startLoading(msg, duration) {
    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<div class="centertext"><img class="custom-spinner" src="assets/img/test_stroke_animated.svg"/><br>' + msg + '</div>',
      duration: duration
    });
    loader.present();
  }

  /**
   * Displays the move options screen.
   * @param {Object} move Move to display information about.
   */
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

  /**
 * Increases the stats of a certain move.
 * @param {Object} move Move whose stats you'd like to increase
 * @param {String} stat Choose 'fun' 'meh' or 'dead' to increase. 'reset' will reset all stats.
 */
  incStat(move, stat) {
    var msgs = ['Okay.', 'Got it.', 'Thanks!', 'Great!', 'Awesome!', 'Cool.']
    var msg = msgs[Math.floor(Math.random() * msgs.length)];
    switch (stat) {
      case 'fun':
        move.stats.fun++;
        break;
      case 'meh':
        move.stats.meh++;
        break;
      case 'dead':
        move.stats.dead++;
        break;
      case 'reset':
        move.stats.fun = 3;
        move.stats.meh = 2;
        move.stats.dead = 1;
      default:
        console.log('Mistake.');
    }
    this.movesService.updateMove(move);
    this.showNotification(msg + ' You voted: ' + stat.toUpperCase(), 1000, 'success');
    setTimeout(() => this.showNotification("Thanks for your feedback! You'll be able to vote for this move again in an hour.", 3300, 'success'), 1500);
  }


  welcomeUser(name) {
    swal({
      title: 'All signed up!',
      type: 'success',
      text: 'Welcome aboard, ' + name + '!',
      showCloseButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Sweet',
      confirmButtonColor: '#886FE8',
      allowOutsideClick: false
    });
  }

  updateStatsBars(move, progbar, funstatbar, mehstatbar, deadstatbar) {

    try {
      console.log("Updating Stats Bars");
      let value = move.stats.people / move.info.capacity;
      let capacity = move.info.capacity;
      var funbarperc;
      var mehbarperc;
      var deadbarperc;
      funbarperc = move.stats.fun / capacity;
      mehbarperc = move.stats.meh / capacity;
      deadbarperc = move.stats.dead / capacity;

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
    } catch (err) {
      console.log('Cannot animate length error.');
    }
  }

  getFeedbackScreen(move) {
    var msgs = ['Hang on!', 'Hold up!', 'Wait a minute!', 'Hey!'];
    var msg = msgs[Math.floor(Math.random() * msgs.length)];
    var me = this;
    var ratingBtns = "You're at <b>" + move.info.name + "</b> right now. How is it?<br><br>" +
      "<button id='funBtn' class='button_sliding_bg fun-color lit'>fun</button>" +
      "<button id='mehBtn' class='button_sliding_bg meh-color meh'>meh</button>" +
      "<button id='deadBtn' class='button_sliding_bg dead-color dead'>dead</button>";
    swal({
      title: msg,
      html: ratingBtns,
      showCloseButton: true,
      showConfirmButton: false,
      allowOutsideClick: false
    }).then(function () {
      swal(
        'Deleted!',
        'Your imaginary file has been deleted.',
        'success'
      )
    }, function (dismiss) {
      // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer' 
      if (dismiss === 'cancel') {
        swal(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })

    $('#funBtn').on('click', function (e) {
      me.incStat(move, 'fun');
      swal.close();
    });
    $('#mehBtn').on('click', function (e) {
      me.incStat(move, 'meh');
      swal.close();
    });
    $('#deadBtn').on('click', function (e) {
      me.incStat(move, 'dead');
      swal.close();
    });
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
    return ((data_B.stats.people / data_B.info.capacity) - (data_A.stats.people / data_A.info.capacity));
  }

  showDay() {
    var d = new Date();
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var message = days[d.getDay()] + " " + this.getTimeOfDay()
    return message;
  }

  showDate() {
    var d = new Date();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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

  public user: any;

  constructor() {
  }


}