import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition, BackgroundGeolocation } from 'ionic-native';
import 'rxjs/add/operator/filter';

/*
  Generated class for the LocationTracker provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocationTracker {

  public distance = 999;
  public watch: any;    
  public lat: number = 0;
  public lng: number = 0;
  public status = 0;

  constructor(public zone: NgZone) {
    console.log('Hello LocationTracker Provider woohoo');
  }

startTracking() {
 
  // Background Tracking
 
  let config = {
    desiredAccuracy: 0,
    stationaryRadius: 20,
    distanceFilter: 3, 
    debug: true,
    interval: 1000 
  };
 
  BackgroundGeolocation.configure((location) => {
 
    console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
 
    // Run update inside of Angular's zone
    this.zone.run(() => {
      this.lat = location.latitude;
      this.lng = location.longitude;
      this.status++;
    });
 
    BackgroundGeolocation.finish(); // FOR IOS ONLY

   }, (err) => {
 
    console.log(err);
 
  }, config);
 
  // Turn ON the background-geolocation system.
  BackgroundGeolocation.start();
 
 
  // Foreground Tracking, this will track and update your location every second.
 
  let options = {
    frequency: 1000, 
    enableHighAccuracy: true
  };
 
  this.watch = Geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
 
    console.log(position);
 
    // Run update inside of Angular's zone
    this.zone.run(() => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.status++;
    });
 
  });
 
}

stopTracking() {

  console.log('stopTracking');
  BackgroundGeolocation.finish();
  this.watch.unsubscribe();

}
}
