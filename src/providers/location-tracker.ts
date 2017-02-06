import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition, BackgroundGeolocation } from 'ionic-native';
import 'rxjs/add/operator/filter';

declare var google;

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


// getLocationName(location) {
//   address = location;
// }

// revGeocode(inlatLng) {
//   var me = this;
//    var geocoder = new google.maps.Geocoder;
//    var location = "NO_ADDRESS";
//     var latLng = inlatLng;
//     geocoder.geocode({'location': latLng}, function(results, status) {
//               if (status === 'OK') {
//                 if (results[0]) {
//                   location = results[0].formatted_address;
//                   console.log(location);
//                   me.getLocationName(location);           
//                 } else {
//                   alert('No results.');
//                   location = 'Nothing.';
//                 }
//               } else {
//                 alert('Geocoder failed due to: ' + status);
//                 location = 'GEOCODER_ERROR';
//               }});
// }
getLocationName(location) {
  // var me = this;
  // me.address = location;
}

revGeocode(address, inlatLng) {
  var me = this;
  address = "LOCATION LOL";
   var geocoder = new google.maps.Geocoder;
   var location = "NO_ADDRESS";
    var latLng = inlatLng;
    geocoder.geocode({'location': latLng}, function(results, status) {
              if (status === 'OK') {
                if (results[0]) {
                  location = results[0].formatted_address;
                  console.log(location);
                  // var getMyLocation = me.getLocationName.bind(me.address);
                  // getMyLocation(location);       
                } else {
                  alert('No results.');
                  location = 'Nothing.';
                }
              } else {
                alert('Geocoder failed due to: ' + status);
                location = 'GEOCODER_ERROR';
              }});
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
