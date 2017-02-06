import { Component, ViewChild, NgZone } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { MovesService } from '../services/MovesService';
import { StatsProvider } from '../../providers/stats-provider';
import { System } from '../functions/functions';

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
  move:any;
  progbar:any;
  funstatbar:any;
  mehstatbar:any;
  deadstatbar:any;
  percentage:any;
  alcStatus = "No.";
  numppl = 0;

  ngAfterViewInit() {
    this.progbar = this.stat.CreateStatsCounter(this.container, this.move);
    this.funstatbar = this.stat.CreateGeneralCounter(this.funbar, 'line', '#27e833', 1400, this.move, this.move.stats.fun);
    this.mehstatbar = this.stat.CreateGeneralCounter(this.mehbar, 'line', '#FBD200', 1600, this.move, this.move.stats.meh);
    this.deadstatbar = this.stat.CreateGeneralCounter(this.deadbar, 'line', '#f9152f', 1800, this.move, this.move.stats.dead);

    setTimeout(() => {
      this.updateStatsBars();
    }, 2000);
  }

  constructor(public navCtrl: NavController, public params: NavParams, public movesService: MovesService, public system: System, public stat: StatsProvider, public zone: NgZone) {
     this.move = params.get("firstPassed");
     //alert('Passed in: ' + this.move);

    /* Perform statistical analysis. */
     if (this.move.info.hasAlcohol) {
       this.alcStatus = "Yes.";
     }
  }

  runUpdateStatsBars() {
      this.system.stat_updates = setInterval(() => {
        this.updateStatsBars();       
    }, 2000);    
  }

incStat(move, stat) {
  this.system.showNotification('Increasing...', 1000);
  switch(stat) {
    case 'fun':
      move.stats.fun++;
      break;
    case 'meh':
      move.stats.meh++;
      break;
    case 'dead':
      move.stats.dead++;
      break;
    default:
      console.log('Mistake.');
 }
  this.movesService.updateMove(move);
  this.updateStatsBars();
}

  updateStatsBars() {
    console.log("updating");
    let value = this.move.stats.people/this.move.info.capacity;
    let capacity = this.move.info.capacity;
    var funbarperc;
    var mehbarperc;
    var deadbarperc;
    funbarperc = this.move.stats.fun/capacity;
    mehbarperc = this.move.stats.meh/capacity;
    deadbarperc = this.move.stats.dead/capacity;

    this.progbar.animate(value);
    if (funbarperc > 0) {
      this.stat.UpdateCounter(this.funstatbar, funbarperc);
    } else {
      this.stat.UpdateCounter(this.funstatbar, 0.003);
    }
    if (mehbarperc > 0) {
      this.stat.UpdateCounter(this.mehstatbar, mehbarperc);
    } else {
      this.stat.UpdateCounter(this.mehstatbar, 0.003);
    }
    if (deadbarperc > 0) {
      this.stat.UpdateCounter(this.deadstatbar, deadbarperc);
    } else {
      this.stat.UpdateCounter(this.deadstatbar, 0.003);
    }     

  }

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

          from: {color: '#9932CC'},
          to: {color: '#FFFFFF'},

          step: (state, bar) => {
            bar.path.setAttribute('stroke', state.color);
            this.numppl = Math.round(bar.value() * move.info.capacity);
            bar.setText(this.numppl + '/' + move.info.capacity);
            bar.text.style.color = state.color;
          }

        });

    progbar.text.style.fontFamily = 'AppFont';
    progbar.text.style.fontSize = '2rem';  

    var perc = move.stats.people/move.info.capacity;

    if (perc > 1) {
      progbar.animate(1);
    } else if (perc >= 0) {
      progbar.animate(perc);     
    } else {
      progbar.animate(0);
    }
    this.progbar = progbar;

  }
}
