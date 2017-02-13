import { Component } from '@angular/core';

import { Facebook, NativeStorage } from 'ionic-native';

import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { NavController } from 'ionic-angular';

import { LoginProvider } from '../../providers/login-provider';
import { StatsProvider } from '../../providers/stats-provider';
import { System, Globals } from '../functions/functions';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { TabsPage } from '../tabs/tabs';
import { HomePage } from '../home/home';

import swal from 'swal';

declare var $: any;
declare var velocity: any;

//var url = 'http://54.175.164.247:80/';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [StatsProvider, System, Globals]
})
export class LoginPage {
  FB_APP_ID: number = 1726230761032513;

  public info = "By Yalies. For Yalies.";
  user:any;
  profinfo:any;

  public firsttime = {
    email: "",
    confirmcode: ""
  };

  public debugflag = true;

  ngAfterViewInit() {
    this.introducePage();
  }

  constructor(public loginProvider: LoginProvider, public system: System, public globals: Globals, public http: Http, public navCtrl: NavController, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    Facebook.browserInit(this.FB_APP_ID, "v2.8");
  }

  introducePage() {
    $('#loginLogo').velocity('transition.flipXIn', { duration: 3000 });
  }

  toggleDebugFlag() {
    this.globals.debugflag = !(this.globals.debugflag);
  }

  doLogin() {
    if (this.globals.debugflag) {
      var element = <HTMLInputElement>document.getElementById("loginBtn");
      element.disabled = true;
      // this.navCtrl.setRoot(TabsPage);
      setTimeout(() => {
        this.presentPrompt();
        element.disabled = false;
      }, 700);
    } else {
      var me = this;
      var permissions = new Array();

      permissions = ["public_profile", "email"];

      Facebook.login(permissions)
        .then(function (res) {

          //let userId = res.authResponse.userID;
          //let social_token = res.authResponse.accessToken;
          let params = new Array();

          //alert(response.authResponse.accessToken);
          return Promise.all([res, Facebook.api("/me?fields=name,email,first_name", params)]);

        })
        .then(function (results) {
          alert("Sign in results! " + JSON.stringify(results[1], null, 4));
          //alert(results[0]);
          //alert("Results: " + results[1] + " name: " + results[1].name);
          //alert(results[1].name);
          // alert("Sign in profinfo " + JSON.stringify(this.profinfo, null, 4));
          return Promise.all([results, me.loginProvider.doApiLogin(results)])


        })
        .then(function (results) {
          /*
          NativeStorage.setItem('user', {
            social_token: results[0][0],
            token: results[1]
          })
          */
          // this.presentWelcome();
          // this.system.welcomeUser(this.results[0][1].first_name);
          me.navCtrl.setRoot(TabsPage);
        })
        .catch(function (error) {
          alert("Error in doLogin(): " + error);
        });
    }

  }

  presentWelcome() {
    let welcome = this.toastCtrl.create({
      message: "Hey " + this.user + "!",
      duration: 1000
    });
    welcome.present();
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'First Time',
      message: "Before we let you sign in, we just need to confirm that you have a yale.edu email. Type it in below and we'll send you a confirmation code.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Yale Email'
        }
      ],
      buttons: [
        {
          text: 'Go Back',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send Confirmation',
          handler: data => {
            this.firsttime.email = data.email;
            if (data.email.endsWith("")) { // Change this back to @yale.edu to filter out Yale emails.
              if (data.email == "@yale.edu") {
                this.presentError("This isn't an email.");
                return false;
              }
              else {
                this.presentConfirmCode();
              }
            } else {
              this.presentError("You didn't type in a valid Yale email.");
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  presentConfirmCode() {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: "Okay, we sent a confirmation code to " + this.firsttime.email + ". Type it in here and that's it!",
      inputs: [
        {
          name: 'code',
          placeholder: 'Confirmation Code'
        }
      ],
      buttons: [
        {
          text: 'Go Back',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: data => {
            if (1) {
              this.navCtrl.setRoot(TabsPage);
            } else {
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  presentError(msg) {
    let msgs = ['Oops', 'Try Again', 'Uh-oh'];
    let alert = this.alertCtrl.create({
      title: msgs[Math.floor(Math.random() * msgs.length)],
      message: msg,
      buttons: ['Go Back']
    });
    alert.present();
  }

}
