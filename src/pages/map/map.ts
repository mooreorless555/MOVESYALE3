import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform, NavParams, NavController } from 'ionic-angular';
// import { NativeStorage } from 'ionic-native';
import { MovesService } from '../services/MovesService';
import { StatsPage } from '../stats/stats'

import { LocationTracker } from '../../providers/location-tracker';
import 'rxjs/Observable';
import 'rxjs/add/operator/map';

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
  //providers: [MovesService]
})
export class MapPage {

  //platform: any;

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  geocoder: any;

  moves: Array<any>;


  constructor(public platform: Platform, public navCtrl: NavController, public params: NavParams, public locationTracker: LocationTracker, public movesService: MovesService) {
    this.platform = platform;
    this.moves = this.movesService.retrieveMoves();
    //alert("Moves: " + this.moves);
    //alert(this.moves);

    //this.listMoves();
    this.initializeMap();

    setInterval(() => {
      // this.map.setOptions({center: new google.maps.LatLng(this.locationTracker.lat, this.locationTracker.lng)});
      this.map.panTo({ lat: this.locationTracker.lat, lng: this.locationTracker.lng });
    }, 300);

    // setInterval(() => {
    //   this.map.setOptions({center: new google.maps.LatLng(this.locationTracker.lat, this.locationTracker.lng)});
    // }, 1000);
    //this.initializeMap();    
  }

  /*
  listMoves() {
    var me = this;

    NativeStorage.getItem('user')
    .then(function(user) {
      //alert("Got token: " + user.token);
      return Promise.all([user, me.movesService.getMoves(user.token)]);
    })
    .then(function(results) {
      //alert(results[1]);
      me.moves = results[1];
      //alert("Got moves: " + me.moves);
    })
    .catch(function(err) {
      alert("Couldn't get tokens " + err);
    });
  }
  */
  /*
  constructor(public navCtrl: NavController) {
    
  }

  ngOnInit() {
    //this.loadMap();
  }

  ionViewDidLoad(){
    //this.loadMap();
  }
 
  loadMap(){
 
    console.log("Loading Map!");
    let latLng = new google.maps.LatLng(-34.9290, 138.6010);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    console.log("Map: " + this.map);
  }
  */

  initializeMap() {

    this.platform.ready()
      .then(() => {
        var minZoomLevel = 17;

        this.map = new google.maps.Map(document.getElementById('map'), {
          zoom: minZoomLevel,
          center: new google.maps.LatLng(41.3083, -72.9279),
          mapTypeId: google.maps.MapTypeId.ROADMAP,

          styles: [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#ebe3cd"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#523735"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#f5f1e6"
                }
              ]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#c9b2a6"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#dcd2be"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#ae9e90"
                }
              ]
            },
            {
              "featureType": "landscape.natural",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#dfd2ae"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#dfd2ae"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#93817c"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#a5b076"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#447530"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#f5f1e6"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#fdfcf8"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#f8c967"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#e9bc62"
                }
              ]
            },
            {
              "featureType": "road.highway.controlled_access",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#e98d58"
                }
              ]
            },
            {
              "featureType": "road.highway.controlled_access",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#db8555"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#806b63"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#dfd2ae"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#8f7d77"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#ebe3cd"
                }
              ]
            },
            {
              "featureType": "transit.station",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#dfd2ae"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#b9d3c2"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#92998d"
                }
              ]
            }
          ]	/*
        });
  
            disableDefaultUI: true,
            styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#fff'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9932CC'}]
            },
              {featureType: 'poi.park',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#ffffff'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#ffffff'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#FFFFFF'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#ffffff'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            },
        {
          featureType: 'poi.business',
          stylers: [{visibility: 'off'}]
        },
        {
          featureType: 'transit',
          elementType: 'labels.icon',
          stylers: [{visibility: 'off'}]
        }
      ]
      */
        });

        var geocoder = new google.maps.Geocoder;
        // var latLng = {lat: 41.3083, lng: -72.92790000000002};
        var latLng = { lat: this.locationTracker.lat, lng: this.locationTracker.lng };
        geocoder.geocode({ 'location': latLng }, function (results, status) {
          if (status === 'OK') {
            if (results[0]) {
              alert(results[0].formatted_address);
            } else {
              alert('No results.');
            }
          } else {
            alert('Geocoder failed due to: ' + status);
          }
        });
      })
      .then(() => {
        //alert("Here: " + this.moves);
        for (let i = 0; i < this.moves.length; i++) {
          this.addMarker(this.moves[i]);
          //this.addMarker(this.moves[i].location.lat, this.moves[i].location.long);
          //this.addMarker(this.moves[i].LatLng);
        }
      })

  }


  addMarker(move) {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(move.LatLng)
    });

    //alert("move: " + move);

    marker.addListener('click', function () {
      //this.map.setCenter(marker.getPosition());
      //this.checkStats(move);
      let lmove = move;

      //alert("In listener, move: " + move.info.name);
      this.navCtrl.push(StatsPage);
    });

    //let content = "<p>Information!</p>";          

    //this.addInfoWindow(marker, content);

  }

  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });


    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  checkStats(move) {
    alert("In check stats, move: " + move);
    this.navCtrl.push(StatsPage);
  }
}