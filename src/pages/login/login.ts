import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';

import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { NavController } from 'ionic-angular';

import { LoginProvider, MoveUser } from '../../providers/login-provider';
import { StatsProvider } from '../../providers/stats-provider';
import { System, Globals } from '../functions/functions';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { TabsPage } from '../tabs/tabs';
// import { HomePage } from '../home/home';

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

  public info = "Literally just like Yale Dining for parties";
  user: any;
  profinfo: any;

  userProfile: any = null;

  public firsttime = {
    email: "",
    confirmcode: ""
  };

  public debugflag = true;

  ngAfterViewInit() {
    this.introducePage();
  }

  constructor(public loginProvider: LoginProvider, private mUser: MoveUser, private facebook: Facebook, public system: System, public globals: Globals, public http: Http, public navCtrl: NavController, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    // Facebook.browserInit(this.FB_APP_ID, "v2.8");
  }


  facebookLogin() {
    $('#loginBtn').prop('disabled', true);
    setTimeout(() => {
    if (!this.globals.debugflag) {
      this.facebook.login(['email', 'public_profile', 'user_friends']).then((response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

          let params = new Array();

        firebase.auth().signInWithCredential(facebookCredential)
        return Promise.all([response, this.facebook.api("/me?fields=name,email,first_name,friends,picture.width(100).height(100)", params)])
          .then((success) => {
            this.mUser.setFB(success);
            alert("Firebase success: " + JSON.stringify(success[1]));
            this.mUser.initUser()
            // this.presentWelcome();
            this.navCtrl.setRoot(TabsPage);
          })
          .catch((error) => {
            alert("Firebase failure: " + JSON.stringify(error));
          });

      }).catch((error) => { console.log(error) });
    } else {
      // this.presentPrompt();
      // this.presentWelcome();
      // this.mUser.initUser()
      this.navCtrl.setRoot(TabsPage);
    }
    }, 800);
  }

  introducePage() {
    $('#loginLogo').velocity('transition.flipXIn', { duration: 3000 });
  }

  toggleDebugFlag() {
    this.globals.debugflag = !(this.globals.debugflag);
  }
  presentWelcome() {
    // let welcome = this.toastCtrl.create({
    //   message: "Hey " + this.mUser.getFB().first_name + "!",
    //   duration: 3000
    // });
    // welcome.present();
    setTimeout(() => this.presentToast('Hey!', 2000), 500);
    setTimeout(() => this.presentToast("This is the Hub- here you'll be able to see an overview of the moves going on right now.", 3000), 3300);
    setTimeout(() => this.presentToast("Really excited you've joined. This'll be the place to check to see if anything is going on! If you want to make a move yourself, just click the + tab below.", 6000), 7000);
  }

  presentToast(msg, duration) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: duration
    });
    toast.present();
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
    // Send email verification.
    firebase.auth().onAuthStateChanged(function(user) {
      user.sendEmailVerification(); 
    });

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
            firebase.auth().onAuthStateChanged(function (user) {
              if (user.emailVerified) {
                this.navCtrl.setRoot(TabsPage);
              } else {
                this.presentError("You haven't yet verified your email!");
              }
            });
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
