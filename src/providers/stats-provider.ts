import { Injectable } from '@angular/core';
// import { System } from '../functions/functions';

declare var $: any;
declare var ProgressBar: any;
declare var google: any;

@Injectable()
export class StatsProvider {

  public counters = [];
  public cnum = 0;

  CreatePeopleCounter(key, value) {
    console.log("Creating Counter at container: " + key);
    var counter = new ProgressBar.SemiCircle('#ctn_' + key, {
      strokeWidth: 18,
      easing: 'easeInOut',
      duration: 1400,
      color: '#9932CC',
      svgStyle: null,

      text: {
        value: '',
        className: "progressbar__label",
      },

      from: { color: '#9932CC' },
      to: { color: '#DCD6F4' },

      step: (state, bar) => {
        bar.path.setAttribute('stroke', state.color);
      }
    });

    counter.text.style.fontFamily = 'AppFont';
    counter.text.style.fontSize = '1.4rem';
    counter.text.style.top = '40px';

    // if (this.CounterExists(key)) {
    //   console.log("Replacing counter data.");
    //   let idx = this.GetCounter(key);
    //   this.counters[idx].c = counter;
    // } else {
    // console.log("Counter does not yet exist. Making room for it.");
    // this.counters.push(
    //   {c: counter, 
    //    key: key});
    // }
    counter.animate(value);
    this.cnum++;
    // console.log(this.counters);
    // return counter;
  }

  RemoveCounter(myKey) {
    let c = this.counters;
    for (let i = 0; i < this.counters.length; i++) {
      if (c[i].key == myKey) {
        c[i].c.destroy();
        c.splice(i, 1);
      }
    }
  }

  CounterExists(myKey) {
    for (let c of this.counters) {
      if (c.key == myKey) {
        return true;
      }
    }
    return false;
  }

  CreateStatsCounter(container, move) {

    console.log("Creating Counter");

    var counter = new ProgressBar.SemiCircle(container.nativeElement, {
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
        let numppl = Math.round(bar.value() * move.info.capacity);
        bar.setText(numppl);
        bar.text.style.color = state.color;
        bar.text.style.fontSize = 2 + bar.value()*2.3 + 'rem';
        // console.log(Object.keys(bar.text.style));
      }
    });

    counter.text.style.fontFamily = 'TruLightFont';
    counter.text.style.fontSize = '2rem';

    var perc = 0;

    if (perc > 1) {
      counter.animate(1);
    } else if (perc >= 0) {
      counter.animate(perc);
    } else {
      counter.animate(0);
    }

    return counter;

  }

  CreateGeneralCounter(container, type, color, duration, move, overflow) {
    var num = 0;
    if (type == 'line') {
      var counter = new ProgressBar.Line(container.nativeElement, {
        strokeWidth: 6,
        easing: 'easeInOut',
        duration: duration,
        color: color,
        svgStyle: { width: '90%', height: '130%' },
        text: {
          position: 'relative',
          // top: '0px',
          bottom: '60px',
          padding: 0,
          margin: 0,
          transform: null
        },
        step: (state, bar) => {

          num = bar.value() * move.info.capacity;
          if (overflow >= num) {
            bar.setText(overflow);
          } else {
            bar.setText(num.toFixed(0));
          }

          bar.text.style.color = state.color;
          // bar.text.style.left = 10 + (bar.value() * 90) + '%';
          bar.text.style.left = 20 + (bar.value() * 95) + '%';
          
        }
      });

      // counter.text.style.fontFamily = 'AppFont';
      counter.text.style.fontFamily = 'AppFont';
      counter.text.style.fontSize = '1.6rem';
      counter.text.style.bottom = '-30px';



      counter.animate(1);
      return counter;
    }

    return -1;

  }

  GetCounter(myKey) {
    for (let c of this.counters) {
      if (c.key == myKey) {
        let idx = this.counters.indexOf(c);
        console.log('FOUND, here: ', idx);
        return idx;
      }
    }
    return null;
  }

  UpdateCounter(counter, value) {
    counter.animate(value);
  }

  UpdateCounter_key(key, value) {
    let counter = $('#ctn_' + key);
    console.log(counter);
    counter.animate(value);
  }

  ResetCounters() {
    this.counters = [];
  }

  between(x, min, max) {
    return x >= min && x <= max;
  }

}