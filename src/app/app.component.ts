import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SignInPage } from '../pages/signin/signin';
import { SignUpPage } from '../pages/signup/signup';
import { FeedStylist } from '../pages/feedstylist/feedstylist';
import { FeedUser } from '../pages/feeduser/feeduser';
import { StylistProfile } from '../pages/stylistprofile/stylistprofile';
import { PostpagePage } from '../pages/postpage/postpage';
import { BookingPage } from '../pages/booking/booking';
import { SettingsPage } from '../pages/settings/settings';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = FeedUser;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleBlackOpaque();
      statusBar.backgroundColorByName('black');
      statusBar.overlaysWebView(false);
      statusBar.isVisible;
      splashScreen.hide();
    });
  }
}