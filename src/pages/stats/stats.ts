import { Component, ViewChild, NgZone } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { MovesService } from '../services/MovesService';
import { StatsProvider } from '../../providers/stats-provider';
import { LocationTracker } from '../../providers/location-tracker';

import { System } from '../functions/functions';

declare var $          : any;
declare var velocity   : any;
declare var google     : any;
declare var ProgressBar: any;

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
  providers: [MovesService, StatsProvider, System]
})



export class StatsPage {
  @ViewChild('containerbig') container;
  @ViewChild('funbar') funbar;
  @ViewChild('mehbar') mehbar;
  @ViewChild('deadbar') deadbar;

  lookup     = {};

  address    = "Retrieving address...";
 dataStreamInfo = "Fetching data...";
  dot = ".";

  id         : any;
  move       : any;
  moves      : any;

  progbar    : any;
  funstatbar : any;
  mehstatbar : any;
  deadstatbar: any;
  percentage : any;
  alcStatus  = "No.";
  numppl     =   0;


  ngAfterViewInit() {
    this.revGeocode(this.move.LatLng);
    this.animatedDot();

    setTimeout(() => {
      this.system.updateStatsBars(this.move, this.progbar, this.funstatbar, this.mehstatbar, this.deadstatbar);
      this.runUpdateStatsBars();
    }, 4000);

  }

  constructor(public navCtrl: NavController, public params: NavParams, public movesService: MovesService, public system: System, public stat: StatsProvider, public zone: NgZone, public locationTracker: LocationTracker) {
    this.move = params.get("firstPassed");
    this.introducePage();
    setInterval(() => {
      var id = this.move._id;
      this.movesService.getMoves_old()
        .subscribe((data) => {
          if (!(this.moves == data)) {
            this.moves = data;
            this.moves.sort(this.system.sortDescending);
            this.system.moves = this.moves;
            console.log(this.moves);
          } else {
            console.log('No change in move.');
          }
        },
        (err) => {
          console.log(err);
        },
        () => {
          console.log('Got Moves');
          for (var i = 0; i < this.moves.length; i++) {
            if (this.moves[i]._id == id) {
              this.move = this.moves[i];
              break;
            }
          }
          // console.log(this.lookup[this.move._id].info.name);
        });
    }, 2000);

    /* Perform statistical analysis. */
    if (this.move.info.hasAlcohol) {
      this.alcStatus = "Yes.";
    }
  }

  runUpdateStatsBars() {
    this.system.stat_updates = setInterval(() => {
      this.system.updateStatsBars(this.move, this.progbar, this.funstatbar, this.mehstatbar, this.deadstatbar);
    }, 2000);
  }


/**
 * Sets the variable 'this.address' to location.
 * @param {string} location - Name of the location.
 */
  getLocationName(location) {
    this.address = location;
  }

  revGeocode(inlatLng) {
    var me       = this;
    var geocoder = new google.maps.Geocoder;
    var location = "NO_ADDRESS";
    var latLng   = inlatLng;
    geocoder.geocode({ 'location': latLng }, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          location = results[0].formatted_address;
          console.log(location);
          me.getLocationName(location);
        } else {
          alert('No results.');
          location = 'Nothing.';
        }
      } else {
        alert('Geocoder failed due to: ' + status);
        location = 'GEOCODER_ERROR';
      }
    });
  }

  animatedDot() {
    setInterval(() => {
      this.dataStreamInfo = "Watching data stream from " + this.move.info.name;
      setTimeout(() => this.dataStreamInfo += ".", 1000);
      setTimeout(() => this.dataStreamInfo += ".", 2000);
      setTimeout(() => this.dataStreamInfo += ".", 3000); 
    }, 5000);
  }
  // incStat(move, stat) {
  //   this.system.showNotification('You voted: ' + stat.toUpperCase(), 1000);
  //   switch(stat) {
  //     case 'fun':
  //       move.stats.fun++;
  //       break;
  //     case 'meh':
  //       move.stats.meh++;
  //       break;
  //     case 'dead':
  //       move.stats.dead++;
  //       break;
  //     case 'reset':
  //       move.stats.fun = 3;
  //       move.stats.meh = 2;
  //       move.stats.dead = 1;
  //     default:
  //       console.log('Mistake.');
  //  }
  //   this.movesService.updateMove(move);
  //   this.updateStatsBars();
  // }

  // updateStatsBars() {

  //   try {
  //   console.log("Updating Stats Bars");
  //   let value = this.move.stats.people/this.move.info.capacity;
  //   let capacity = this.move.info.capacity;
  //   var funbarperc;
  //   var mehbarperc;
  //   var deadbarperc;
  //   funbarperc = this.move.stats.fun/capacity;
  //   mehbarperc = this.move.stats.meh/capacity;
  //   deadbarperc = this.move.stats.dead/capacity;

  //   this.progbar.animate(value);
  //   if (funbarperc > 0) {
  //     this.stat.UpdateCounter(this.funstatbar, funbarperc);
  //   } else {
  //     this.stat.UpdateCounter(this.funstatbar, 0.003);
  //   }
  //   if (mehbarperc > 0) {
  //     this.stat.UpdateCounter(this.mehstatbar, mehbarperc);
  //   } else {
  //     this.stat.UpdateCounter(this.mehstatbar, 0.003);
  //   }
  //   if (deadbarperc > 0) {
  //     this.stat.UpdateCounter(this.deadstatbar, deadbarperc);
  //   } else {
  //     this.stat.UpdateCounter(this.deadstatbar, 0.003);
  //   } 
  //  } catch(err) {
  //    console.log('Weird error.', err);
  //  }    
  // }

  createProgBar(moves_container, move) {
    console.log("Executing createProgbar...");
    var progbar = new ProgressBar.SemiCircle(moves_container.nativeElement, {
      strokeWidth: 18,
      easing: 'easeInOut',
      duration: 2300,
      color: '#9932CC',
      svgStyle: null,

      text: {
        value: '',
        className: 'progressbar__label',
      },

      from: { color: '#9932CC' },
      to: { color: '#FFFFFF' },

      step: (state, bar) => {
        bar.path.setAttribute('stroke', state.color);
        this.numppl = Math.round(bar.value() * move.info.capacity);
        bar.setText(this.numppl);
        bar.text.style.color = state.color;
      }

    });

    progbar.text.style.fontFamily = 'AppFont';
    progbar.text.style.fontSize = '2rem';


    var perc = move.stats.people / move.info.capacity;

    if (perc > 1) {
      progbar.animate(1);
    } else if (perc >= 0) {
      progbar.animate(perc);
    } else {
      progbar.animate(0);
    }
    this.progbar = progbar;

  }

  introducePage() {

    setTimeout(() => { $('#headerTextSection').removeClass('hide').velocity('transition.shrinkIn') });
    setTimeout(() => { $('#extraInfoTextSection').removeClass('invisible').velocity('transition.flipXIn', 500)}, 500);
    setTimeout(() => { $('#addressSection').removeClass('hide').velocity('transition.flipYIn'), { duration: 2000 } }, 800);
    setTimeout(() => { $('#ANIM_ratingstrip').removeClass('hide').addClass('animatestrip') }, 1300);
    setTimeout(() => {

      $('#statsSection').removeClass('invisible');
      $("ion-col").velocity('transition.flipXIn', { stagger: 400 });
      this.progbar     = this.stat.CreateStatsCounter(this.container, this.move);
      this.funstatbar  = this.stat.CreateGeneralCounter(this.funbar, 'line', '#27e833', 1400, this.move, this.move.stats.fun);
      this.mehstatbar  = this.stat.CreateGeneralCounter(this.mehbar, 'line', '#FBD200', 1600, this.move, this.move.stats.meh);
      this.deadstatbar = this.stat.CreateGeneralCounter(this.deadbar, 'line', '#f9152f', 1800, this.move, this.move.stats.dead);
    }, 1600);
    setTimeout(() => {
      $('#infoSection').removeClass('hide');
      $("*[id*=info]").velocity('transition.shrinkIn', { stagger: 800 })
      $('#infoSection').animate({scrollTop: 0});
    }, 2400)

  }

}
