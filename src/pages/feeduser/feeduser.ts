import { NgZone, Component, trigger, state, style, transition, animate, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { LoadingController, Content } from 'ionic-angular';
import { StylistProfile } from '../stylistprofile/stylistprofile';
import { FeedStylist } from '../feedstylist/feedstylist';

import { UserBooking } from '../userbooking/userbooking';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { PopUp } from '../../modals/popup/popup';
import { PopUpOther } from '../../modals/popupother/popupother';
import { OnDestroy } from "@angular/core";
import { ISubscription } from "rxjs/Subscription";
import * as firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Diagnostic } from '@ionic-native/diagnostic';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { UserViewProfile } from '../userviewprofile/userviewprofile';
import { UserProfile } from '../userprofile/userprofile';
import { FullfeedPage } from '../fullfeed/fullfeed';
import { CacheService } from 'ionic-cache';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';



import { SwiperConfigInterface } from 'ngx-swiper-wrapper';


const limit:BehaviorSubject<number> = new BehaviorSubject<number>(2); // import 'rxjs/BehaviorSubject';

@Component({
  selector: 'page-feed-user',
  templateUrl: 'feeduser.html',
  animations: [
 
    trigger('slideDown', [
      state('down', style({
        height: '250px',
      })),
      state('notDown', style({
        height:'88px',
      })),
      transition('* => *', animate('400ms ease-in')),
    ]),
    trigger('moveList', [
      state('down', style({
        'margin-top': "40%",
      })),
      state('up', style({
        'margin-top': "-5%",
      })),
      transition('* => *', animate('400ms ease-in')),
    ]),
    trigger('toolSlide', [
      state('down', style({
        top: '0px'
      })),
      state('up', style({
        top: '0px'
      })),
      transition('* => *', animate('400ms ease-in')),
    ]),
    trigger('show', [
      state('down', style({
        display: 'block',
      })),
      state('up', style({
        display: 'none',
      })),
      transition('* => *', animate('400ms ease-in')),
    ]),
    trigger('showHeight', [
      state('down', style({
        display: 'block',
      })),
      state('up', style({
        display: 'none',
      })),
      transition('* => *', animate('400ms ease-in')),
    ]),
  ]
})
export class FeedUser implements OnDestroy {
  @ViewChild('changeText') changeText: ElementRef;
  @ViewChild('availability') availability: ElementRef;
  @ViewChild('contentone') contentOne: ElementRef;
  @ViewChild('ratings') ratingbox: ElementRef;
  @ViewChild('weeklydeals') weekly: ElementRef;
  @ViewChild('promos') promos: ElementRef;
  @ViewChild('weekly') weeklyyellow: ElementRef;
  @ViewChild('price') price: ElementRef;
  @ViewChild('distance') distancey: ElementRef;
  @ViewChild('noavail') noavail;
  @ViewChild('infinitescroll') infinitescroll: ElementRef;

  @ViewChild(Content  ) content: Content;

  downState: String = 'notDown';
  moveState: String = 'up';
  toolbarState: String = 'up';
  showDropDown: String = 'up';
  showDropDownHeight: String = 'up';
  appointments: FirebaseListObservable<any>;
  appointmentsMonth: FirebaseListObservable<any>;
  appointmentsItem: FirebaseListObservable<any>;
  show = true;
  lastScrollTop: number = 0;
  direction: string = "";
  prices: FirebaseListObservable<any>;
  ratingslist:FirebaseListObservable<any>
  distancelist: FirebaseListObservable<any>;
  prom: FirebaseListObservable<any>;
  pricesArray = [];
  distances = [];
  stars;
  starsArray = [];
  rrr;


  private subscription: ISubscription;
  private subscription2: ISubscription;
  private subscription3: ISubscription;
  private subscription4: ISubscription;
  private subscription5: ISubscription;
  private subscription6: ISubscription;
  private subscription7: ISubscription;
  private subscription8: ISubscription;
  private subscription9: ISubscription;
  private subscription10: ISubscription;
  private subscription11: ISubscription;
  private subscription12: ISubscription;
  private subscription13: ISubscription;
  private subscription14: ISubscription;


  queryable: boolean = true;


  toolbarClicks = 0;

  list: FirebaseListObservable<any>;
  list2: FirebaseListObservable<any>;
  list4: FirebaseListObservable<any>;
  list5: FirebaseListObservable<any>;
  list6: FirebaseListObservable<any>;
  objj: FirebaseObjectObservable<any>;
  availabilities = [];
  items = [];
  rating = [];
  promotions = [];
  username;

  totalCount = 0;
  lastNumRows = 0;
  el;
  startAtKey;
  startAtKeyAvail;
  lastKey;

  ads = [];
  swiperIndex;
  config: SwiperConfigInterface;
  swiperEvent;
  totalAdCount;
  swiperSize = 'begin';
  startAtKey1;
  lastKey1;
  startAtKey2;
  lastKey2;
  startAtKey3;
  lastKey3;
  startAtKey4;
  lastKey4;
  startAtKey5;
  lastKey5;

  constructor(public elRef: ElementRef, private cache: CacheService, private diagnostic: Diagnostic, private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation, public zone: NgZone, public modalCtrl: ModalController, public af: AngularFireDatabase, public storage: Storage, private afAuth: AngularFireAuth, public renderer: Renderer, public loadingController: LoadingController, public navCtrl: NavController) {
     
  }

  loadModal(salon) {
    let profileModal = this.modalCtrl.create(PopUpOther, { salon: salon });
    profileModal.present();
  }

  doInfinite(infiniteScroll) {
    console.log("in doinfinite promotionsssssss");
    setTimeout(() => {
      console.log('Begin async operation');
      /*console.log(this.content.directionY + "        upupupupupupu********");
      if(this.content.directionY == 'up') {
        this.show = false
      }
      else {
        this.show = true;
      }*/

      console.log(this.startAtKey1 + "     before %%^&^&^% start at");
      this.list2 = this.af.list('/promotions', {
      query: {
        orderByKey: true,
        endAt: this.startAtKey1,
        limitToLast: 11
      }});

      this.subscription11 = this.list2.subscribe(items => { 
          let x = 0;
          this.lastKey1 = this.startAtKey1;
          items.forEach(item => {


            let storageRef = firebase.storage().ref().child('/settings/' + item.customMetadata.username + '/profilepicture.png');
                       
            storageRef.getDownloadURL().then(url => {
              console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
              item.customMetadata.picURL = url;
            }).catch((e) => {
              console.log("in caught url !!!!!!!$$$$$$$!!");
              item.customMetadata.picURL = 'assets/blankprof.png';
            });
            
            if(this.startAtKey1 !== item.$key && this.lastKey1 !== item.$key) {
              console.log(this.startAtKey1 + "   :startAtKey1 before 4444444        item key:     " + item.$key);
              if(item.customMetadata.username != null) {
                this.promotions.push(item.customMetadata); //unshift?**************
              }
            }

            if(x == 0) {
              this.startAtKey1 = item.$key;
            }

            x++;
          });          
          
      })

      infiniteScroll.complete(); 
        
    }, 500);
  }

  doInfiniteP() {
    console.log("in doinfinite promotionsssssss");
    setTimeout(() => {
      console.log('Begin async operation');
      /*console.log(this.content.directionY + "        upupupupupupu********");
      if(this.content.directionY == 'up') {
        this.show = false
      }
      else {
        this.show = true;
      }*/

      console.log(this.startAtKey2 + "     before %%^&^&^% start at");
      this.list4 = this.af.list('/profiles/stylists', {
      query: {
        orderByKey: true,
        endAt: this.startAtKey2,
        limitToLast: 11
      }});

      this.subscription12 = this.list4.subscribe(items => { 
          let x = 0;
          console.log(JSON.stringify(items[0]) + "     items 00000000000000");
          this.lastKey2 = this.startAtKey2;
          items.forEach(item => {


            let storageRef = firebase.storage().ref().child('/settings/' + item.username + '/profilepicture.png');
                       
            storageRef.getDownloadURL().then(url => {
              console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
              item.picURL = url;
            }).catch((e) => {
              console.log("in caught url !!!!!!!$$$$$$$!!");
              item.picURL = 'assets/blankprof.png';
            });
            

            if(this.startAtKey2 !== item.$key && this.lastKey2 !== item.$key) {
              console.log(this.startAtKey2 + "   :startAtKey2:");
              console.log(item.$key + "   :itemkey:");
              console.log(this.lastKey2 + "   :lastkey:");
              if(item.price != null) {
                this.pricesArray.push(item); //unshift?**************
              }
            }

            if(x == 0) {
              this.startAtKey2 = item.$key;
            }

            x++;
          });          
          
      })

      this.pricesArray.sort(function(a,b) {
        return b.price.length - a.price.length;
      });

      //infiniteScroll.complete(); 
        
    }, 500);
  }

  doInfiniteR() {
    console.log("in doinfinite promotionsssssss");
    setTimeout(() => {
      console.log('Begin async operation');
      /*console.log(this.content.directionY + "        upupupupupupu********");
      if(this.content.directionY == 'up') {
        this.show = false
      }
      else {
        this.show = true;

      }*/

      console.log(this.startAtKey3 + "     before startatkey3 start at 67767676765676765757");
      this.list5 = this.af.list('/profiles/stylists', {
      query: {
        orderByKey: true,
        endAt: this.startAtKey3,
        limitToLast: 11
      }});

      this.subscription13 = this.list5.subscribe(items => { 
          let x = 0;
          console.log(JSON.stringify(items[0]) + "     items 00000000000000");
          this.lastKey3 = this.startAtKey3;
          console.log(this.lastKey3 + " lastkey3333333333333asdfasdasdfasdfweew32323223fasdfasdf beginning");
          items.forEach(item => {


            let storageRef = firebase.storage().ref().child('/settings/' + item.username + '/profilepicture.png');
                       
            storageRef.getDownloadURL().then(url => {
              console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
              item.picURL = url;
            }).catch((e) => {
              console.log("in caught url !!!!!!!$$$$$$$!!");
              item.picURL = 'assets/blankprof.png';
            });

            if(item.rating.one == 0 && item.rating.two == 0 && item.rating.three == 0 && item.rating.four == 0 && item.rating.five == 0) {
              this.stars = "No ratings";
            }
            else {

              console.log("making the stars");
              let totalPotential;
              let ratings;
              totalPotential = item.rating.one * 5 + item.rating.two * 5 + item.rating.three * 5 + item.rating.four * 5 + item.rating.five * 5;
              ratings = item.rating.one + item.rating.two * 2 + item.rating.three * 3 + item.rating.four * 4 + item.rating.five *5;
              

              let i = (ratings / totalPotential) * 100;
              if(Math.round(i) <= 20) {
                this.stars = '\u2605';
              }
              if(Math.round(i) > 20 && Math.round(i) <= 40) {
                this.stars = '\u2605\u2605';
              }
              if(Math.round(i) > 40 && Math.round(i) <= 60) {
                this.stars = '\u2605\u2605\u2605';
              }
              if(Math.round(i) > 60 && Math.round(i) <= 80) {
                this.stars = '\u2605\u2605\u2605\u2605';
              }
              if(Math.round(i) > 80) {
                this.stars = '\u2605\u2605\u2605\u2605\u2605';
              }
            }

            item.stars = this.stars;
            
            //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');
            
            if(this.startAtKey3 !== item.$key && this.lastKey3 !== item.$key) {
              console.log(this.startAtKey3 + "   :startAtKey3 being pushed       item key:     " + item.$key);
              if(item.username != null) {
                this.rating.push(item); //unshift?**************
              }
            }

            if(x == 0) {
              this.startAtKey3 = item.$key;
            }

            console.log(this.startAtKey3 + " startatkeyyyyyyyy33333dddddddd33333333asdfasdfasdfasdf end");
            console.log(item.$key + " item.$key       33dddddddd33333333asdfasdfasdfasdf end");

            x++;
          });          
          
      })

      this.rating.sort(function(a,b){ 
        if(a.stars !== "No ratings" && b.stars !== "No ratings") {
          if(a.stars === b.stars){
            return 0;
          }
          else {
            return a.stars.length < b.stars.length ? 1 : -1;
          }
        }
        else {
          if(a.stars === "No ratings"){
            return 1;
          }
          else if(b.stars === "No ratings"){
            return -1;
          }
        }

      });

      //infiniteScroll.complete(); 
        
    }, 500);
  }

  doInfiniteD() {
    console.log("in doinfinite distance");
    setTimeout(() => {
      console.log('Begin async operation');
      /*console.log(this.content.directionY + "        upupupupupupu********");
      if(this.content.directionY == 'up') {
        this.show = false
      }
      else {
        this.show = true;

      }*/

      console.log(this.startAtKey4 + "     before startatkey4 start at 67767676765676765757");
      this.list6 = this.af.list('/distances/'+this.username, {
      query: {
        orderByChild: 'distance',
        startAt: this.startAtKey4,
        limitToFirst: 11
      }});

      this.subscription14 = this.list6.subscribe(items => { 
          let x = 0;
          console.log(JSON.stringify(items[0]) + "     items 00000000000000");
          this.lastKey4 = this.startAtKey4;
          console.log(this.lastKey4 + " lastkey3333333333333asdfasdasdfasdfweew32323223fasdfasdf beginning");
          items.forEach(item => {
            let arr;
            if(x == 0) {
              //
            }
            else {

              let storageRef = firebase.storage().ref().child('/settings/' + item.username + '/profilepicture.png');
                             
              storageRef.getDownloadURL().then(url => {
                console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
                item.picURL = url;
              }).catch((e) => {
                console.log("in caught url !!!!!!!$$$$$$$!!");
                item.picURL = 'assets/blankprof.png';
              });

              this.distances.push(item);

              if(x == items.length - 1) {
                console.log("inside items.length - 1    " + item.distance);
                this.startAtKey4 = item.distance;
              }

              console.log(this.startAtKey4 + " startatkeyyyyyyyy33333dddddddd33333333asdfasdfasdfasdf end");
              //console.log(item.$key + " item.$key       33dddddddd33333333asdfasdfasdfasdf end");
            }

            x++;

          })

       })         
          
        //})      
    }, 500);
  }

  doInfiniteA() {
    console.log("in doinfinite promotionsssssss");
    setTimeout(() => {
      console.log('Begin async operation');
      /*console.log(this.content.directionY + "        upupupupupupu********");
      if(this.content.directionY == 'up') {
        this.show = false
      }
      else {
        this.show = true;
      }*/

      console.log(this.startAtKey5 + "     before %%^&^&^% start at");
      this.list4 = this.af.list('/profiles/stylists', {
      query: {
        orderByKey: true,
        endAt: this.startAtKey5,
        limitToLast: 11
      }});

      this.subscription12 = this.list4.subscribe(items => { 
          let x = 0;
          console.log(JSON.stringify(items[0]) + "     items 00000000000000");
          this.lastKey5 = this.startAtKey5;
          items.forEach(item => {


            let storageRef = firebase.storage().ref().child('/settings/' + item.username + '/profilepicture.png');
                       
            storageRef.getDownloadURL().then(url => {
              console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
              item.picURL = url;
            }).catch((e) => {
              console.log("in caught url !!!!!!!$$$$$$$!!");
              item.picURL = 'assets/blankprof.png';
            });
            

            if(this.startAtKey5 !== item.$key && this.lastKey5 !== item.$key) {
              console.log(this.startAtKey5 + "   :startAtKey5:");
              console.log(item.$key + "   :itemkey:");
              console.log(this.lastKey5 + "   :lastkey:");
              if(item.price != null) {
                this.pricesArray.push(item); //unshift?**************
              }
            }

            if(x == 0) {
              this.startAtKey5 = item.$key;
            }

            x++;
          });          
          
      })

      this.pricesArray.sort(function(a,b) {
        return b.price.length - a.price.length;
      });

      //infiniteScroll.complete(); 
        
    }, 500);
  }

  getAds() {
    let promises_array:Array<any> = [];
    let cacheKey = 'ads';

    
      this.cache.getItem(cacheKey).catch(() => {
        let store = [];
        console.log("in get addddssss ******");
        this.objj = this.af.object('/adcounter/count')

        this.subscription6 = this.objj.subscribe(item => { 
          console.log(JSON.stringify(item) + "in adddd subscribe()()()()()()");
          console.log(typeof item);
          this.totalAdCount = item.$value;
          
            for(let x = 1; x < item.$value + 1; x++) {
              console.log("in promise gafdfsfads")
              promises_array.push(new Promise((resolve,reject) => {

                let storageRef = firebase.storage().ref().child('/ads/ad' + x + '.png');
                storageRef.getDownloadURL().then(url => {
                  console.log(url);
                  store.push(url);
                  console.log("reigh before resolve");
                  resolve()
                  
                }).catch(e => {
                  resolve();
                });

              }));
            }

          let results = Promise.all(promises_array);
          results.then((value) => {
            this.ads = store;

            console.log(JSON.stringify(this.ads) + " value value vlaue");

            console.log("in list all");
            
            return this.cache.saveItem(cacheKey, this.ads);
          })
      })

        
    }).then((data) => {
        console.log("Saved data: ", data);
        this.ads = data;
    });

  }



  indexChange() {
    console.log(this.swiperIndex);
    if(this.swiperSize == 'small' || 'begin') {
      if(this.totalAdCount - 4 == this.swiperIndex) {
        this.navCtrl.push(UserProfile,{},{animate:true,animation:'transition',duration:100,direction:'forward'});
      }
      else if(this.swiperIndex == 0) {
        //this.navCtrl.push(FollowersPage,{},{animate:true,animation:'transition',duration:100,direction:'back'});
      }
    }
    else {
      if(this.totalAdCount - 1 == this.swiperIndex) {
        this.navCtrl.push(UserProfile,{},{animate:true,animation:'transition',duration:100,direction:'forward'});
      }
      else if(this.swiperIndex == 0) {
        //this.navCtrl.push(FollowersPage,{},{animate:true,animation:'transition',duration:100,direction:'back'});
      }
    }
  }

  swipeLeft() {
    this.navCtrl.push(UserViewProfile, {
      param1: 'user'
    },{animate:true,animation:'transition',duration:100,direction:'forward'});
  }

  toUserBooking() {
    
  }

  toProfile() {
    this.navCtrl.push(StylistProfile,{},{animate:true,animation:'transition',duration:100,direction:'forward'});
  }

  toFull() {
    this.navCtrl.push(FullfeedPage,{},{animate:true,animation:'transition',duration:100,direction:'back'});
  }

  toBooking() {
    this.navCtrl.push(UserBooking, {
      param1: 'user'
    },{animate:true,animation:'transition',duration:100,direction:'back'});
  }

  ngOnDestroy() {
    if(this.subscription != null) {
      this.subscription.unsubscribe();
    }
    if(this.subscription2 != null) {
      this.subscription2.unsubscribe();
    }
    if(this.subscription3 != null) {
      this.subscription3.unsubscribe();
    }
    if(this.subscription4 != null) {
      this.subscription4.unsubscribe();
    }
    if(this.subscription5 != null) {
      this.subscription5.unsubscribe();
    }
    if(this.subscription6 != null) {
      this.subscription6.unsubscribe();
    }
    if(this.subscription7 != null) {
      this.subscription7.unsubscribe();
    }
    if(this.subscription8 != null) {
      this.subscription8.unsubscribe();
    }
    if(this.subscription9 != null) {
      this.subscription9.unsubscribe();
    }
    if(this.subscription10 != null) {
      this.subscription10.unsubscribe();
    }
    if(this.subscription11 != null) {
      this.subscription11.unsubscribe();
    }
    if(this.subscription12 != null) {
      this.subscription12.unsubscribe();
    }
  } 

  pushPage(){
    // push another page on to the navigation stack
    // causing the nav controller to transition to the new page
    // optional data can also be passed to the pushed page.
    //this.navCtrl.push(SignUpPage);
  }

  ionViewWillLoad() {
    this.subscription = this.afAuth.authState.subscribe(data => {
      /*if(data.email && data.uid) {
        console.log("logged in");
      }*/
    })


  }



  scrollHandler(event) {
   //console.log(JSON.stringify(event));
   this.zone.run(()=>{
     if(event.directionY == 'up') {
       this.show = false;
     }
     else {
       this.show = true;
     }
     // since scrollAmount is data-binded,
     // the update needs to happen in zone
     //this.scrollAmount++
   })
  }

  distance(lat1, lon1, lat2, lon2, unit) {
    let radlat1 = Math.PI * lat1/180
    let radlat2 = Math.PI * lat2/180
    let theta = lon1-lon2
    let radtheta = Math.PI * theta/180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
  }

  round(number, precision) {
    let factor = Math.pow(10, precision);
    let tempNumber = number * factor;
    let roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };

  loadDistances() {
    //return new Promise((resolve, reject) => {
      let cacheKey = "distances"
      let arr = [];
      let mapped;
      //this.cache.removeItem(cacheKey);

      console.log("IN LOADDISTANCES #$$$$$$$$$$$$$$$$$$$$$");

      //this.geolocation.getCurrentPosition().then((resp) => {            
          // resp.coords.latitude
          console.log("IN geo get position #$$$$$$$5354554354$$$$$$$");

          //this.rrr = resp;
          //console.log(this.rrr + "              this.rrrthis.rrrthis.rrrthis.rrrthis.rrrthis.rrrthis.rrrthis.rrrrr");
          //this.cache.getItem(cacheKey).catch(() => {
          //setTimeout(() => {
            this.distancelist = this.af.list('/distances/' + this.username, { query: {
              orderByChild: 'distance',
              limitToFirst: 10
            }});
      
            let x = 0;
            this.subscription6 = this.distancelist.subscribe(items => {

               
               console.log(JSON.stringify(items) + "      length - 1 load");
               
               console.log("BEGGINNING STARTATKEY4 WITH DISTANCE:    " + this.startAtKey4);
               

               items.forEach(item => {
                 let storageRef = firebase.storage().ref().child('/settings/' + item.username + '/profilepicture.png');
                             
                  storageRef.getDownloadURL().then(url => {
                    console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
                    item.picURL = url;
                  }).catch((e) => {
                    console.log("in caught url !!!!!!!$$$$$$$!!");
                    item.picURL = 'assets/blankprof.png';
                  });

                 this.distances.push(item);

                 if(x == items.length - 1) {
                   this.startAtKey4 = items[x].distance;
                 }

                 x++;
               })
               
               /*mapped = items.map((item) => {
                return new Promise(resolve => {
                  let rr;
                  //console.log(JSON.stringify(item) + "               *((*&*&*&*&^&*&*&*(&*(&*&*(&(&(&*(              :::" + x);
                  //if(item.address == "") {
                    //resolve();
                  //}
                  else {
                    console.log(item.address + " is the address empty??????");
                    this.nativeGeocoder.forwardGeocode(item.address)
                      .then((coordinates: NativeGeocoderForwardResult) => {
                        console.log("I AM IN THE GEOCODING ***&&*&*&*&*");
                          rr = this.round(this.distance(coordinates.latitude, coordinates.longitude, this.rrr.coords.latitude, this.rrr.coords.longitude, "M"), 1);
                          if(!item.picURL) {
                            item.picURL = 'assets/blankprof.png';
                          }
                          arr.push({'pic':item.picURL, 'salon':item.username, 'distance':rr});
                          console.log("push to the array of results");
                          //x++;
                          /*console.log(items.length + "         length   /    x:        " + x);
                          if(items.length - x == 1) {
                            console.log("getting resolved in geocoder ^&^&^&&^^&^&^&");
                            resolve(arr);
                          }
                          //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');

                          resolve();
                        }).catch(e => {
                          console.log(e.message + " caught this error");
                          /*x++;
                          if(items.length - x == 1) {
                            resolve(arr);
                          }
                          resolve();
                        })*/

                    
                      //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');
                    

                })
              //})

              /*let results = Promise.all(mapped);
              results.then(() => {
                console.log(JSON.stringify(arr) + " :FOSIEJO:SFJ::EFIJSEFIJS:EFJS:IO THIS IODIOSJ:FDSIJ :DIS");
                
                arr.sort(function(a,b) {
                  return a.distance - b.distance;
                });

                this.distances = arr.slice();

                console.log(JSON.stringify(this.distances) + " ^^^^&&&&&&&********88889999000000000");

                resolve();
                //return this.cache.saveItem(cacheKey, this.distances);
              })
            });

          })*/  
              
            /*}).then(data => {
              this.distances = data
            })*/
          //}, 1500)
 

          

      /*}).catch((error) => {
        this.diagnostic.switchToLocationSettings();
        console.log('Error getting location', error.message);
        resolve();
      });*/

    /*}).catch((error) => {
      console.log('Error getting location', error);
    });*/

    
  }

  loadPromotions() {
    console.log("In loadPromotions fdskkfdskldfkfdslkfds");
    
    this.prom = this.af.list('/promotions', { query: {
      limitToLast: 14
    }});

    this.promotions = [];

    this.subscription10 = this.prom.subscribe(items => { 

      this.startAtKey1 = items[0].$key;
      this.lastKey1 = this.startAtKey1;

      items.forEach(item => {
      //mapped = items.map((item) => {
        //return new Promise(resolve => {

            this.promotions.push(item.customMetadata);
            console.log("pushing ITEM (((((()()()()()() promotions" + JSON.stringify(item.customMetadata));
            //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');

            
          
        //})  
      //})
      
      });

      
    });

    if(this.promotions != []) {
      //this.renderer.setElementStyle(this.noavail._elementRef.nativeElement, 'display', 'none');
    }
  }

  loadPrices() {
    //let mapped;
    //let cacheKey = "prices";
    //let results2;
    
    //this.cache.removeItem(cacheKey);

    //this.cache.getItem(cacheKey).catch(() => {

      //let array = [];

      this.prices = this.af.list('/profiles/stylists', {
        query: {
          orderByChild: 'price',
          limitToLast: 10
        }
      });
      this.subscription5 = this.prices.subscribe(items => { 
        
        this.startAtKey2 = items[0].$key;
        this.lastKey2 = this.startAtKey2;

        items.forEach(item => {
        //mapped = items.map((item) => {
          //return new Promise(resolve => {
            if(item.price == null) {
              //
            }
            else {
              console.log(JSON.stringify(item));
              if(!item.picURL) {
                item.picURL = 'assets/blankprof.png';
              }
              if(item.price !== undefined) {
                this.pricesArray.push(item); //unshift?**************
              }
              //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');

            }
          //})  
        //})
        
        })
      });

        //results2 = Promise.all(mapped);
        //results2.then(() => {  
        //this.pricesArray = array;
        //console.log(this.pricesArray + "     pricesathis.rrrraaayyy ITEM (((((()()()()()() loadprices")   
        //return this.cache.saveItem(cacheKey, this.pricesArray);
      //})    
    /*}).then(data => {
      this.pricesArray = data;
    })*/
  }

  loadRatings(): Promise<any> {
    return new Promise((resolve, reject) => {
      let mapped;
      let cacheKey = "ratings";
      let results;
      let array = [];

      //this.cache.getItem(cacheKey).catch(() => {

        this.ratingslist = this.af.list('/profiles/stylists', { query: {
          orderByKey: true,
          limitToLast: 10
        }});
        this.subscription7 = this.ratingslist.subscribe(items => {

            this.startAtKey3 = items[0].$key;
            this.lastKey3 = this.startAtKey3;

            console.log(this.startAtKey3 + " startatkey3333333333333 beginning");
            console.log(this.lastKey3 + " lastkey3333333333333asdfasdfasdfasdf beginning");


            mapped = items.map((item) => {
              return new Promise(resolve => {
                if(!item.picURL) {
                  item.picURL = 'assets/blankprof.png';
                }

                for(let z in item.rating) {
                  console.log(z + "this is the rating string");
                }

                console.log(JSON.stringify(item) + "stringifyied item &&^^&%^%^%^$$%%$");
                if(item.type == "stylist") {
                  console.log("getting pushed &&%$$##@#@#@#@#@#");
                  array.push(item);
                }

                resolve();
                
              })

            })

            Promise.all(mapped).then(() => {
          //return this.cache.saveItem(cacheKey, array);
              console.log("resolved ***&&&^^^%%%$$$$$$$");
              resolve(array);
            })
         
        }) 
        

        
        

    });
  }

  ionViewDidEnter() {
    //this.distances = [];
    //this.loadDistances();
    if(this.distances == null) {
      this.loadDistances();
    }
  }
     

  ionViewDidLoad() {
    this.storage.get('username').then((val) => {
      this.username = val;
    })

    this.loadAvailabilities();

    setTimeout(() => {
      this.renderer.setElementStyle(this.elRef.nativeElement.querySelector('.scroll-content'), 'margin-top', '43%');
    }, 750)
    
    let element = this.elRef.nativeElement.querySelector('.scroll-content');
    element.addEventListener('scroll', (event) =>
    {
        var element = event.target;
        if (element.scrollHeight - element.scrollTop === element.clientHeight)
        {
            console.log('scrolled');
            if(this.weekly.nativeElement.style.display != 'none') {
              console.log("in doinfinite promotionsssssss");
              setTimeout(() => {

                console.log(this.startAtKey1 + "     before %%^&^&^% start at");
                this.list2 = this.af.list('/promotions', {
                query: {
                  orderByKey: true,
                  endAt: this.startAtKey1,
                  limitToLast: 11
                }});

                this.subscription11 = this.list2.subscribe(items => { 
                    let x = 0;
                    this.lastKey1 = this.startAtKey1;
                    items.forEach(item => {


                      let storageRef = firebase.storage().ref().child('/settings/' + item.customMetadata.username + '/profilepicture.png');
                                 
                      storageRef.getDownloadURL().then(url => {
                        console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
                        item.customMetadata.picURL = url;
                      }).catch((e) => {
                        console.log("in caught url !!!!!!!$$$$$$$!!");
                        item.customMetadata.picURL = 'assets/blankprof.png';
                      });
                      
                      if(this.startAtKey1 !== item.$key && this.lastKey1 !== item.$key) {
                        console.log(this.startAtKey1 + "   :startAtKey1 before 4444444        item key:     " + item.$key);
                        if(item.customMetadata.username != null) {
                          this.promotions.push(item.customMetadata); //unshift?**************
                        }
                      }

                      if(x == 0) {
                        this.startAtKey1 = item.$key;
                      }

                      x++;
                    });          
                    
                })

                //infiniteScroll.complete(); 
                  
              }, 500);
            }
            else if(this.price.nativeElement.style.display != 'none') {
              this.doInfiniteP();
            }
            else if(this.ratingbox.nativeElement.style.display != 'none') {
              this.doInfiniteR();
            }
            else if(this.distancey.nativeElement.style.display != 'none') {
              this.doInfiniteD();
            }
        }
    });

    this.loadPromotions();
    this.getAds();
    //setTimeout(() => {


      //div.style.marginTop = "-47%";
      
    //}, 1000);
    
    

    
    let ratings;
    let totalPotential;

    this.loadRatings().then(array =>{

          console.log(array + '    ararrya &&*&&*&^^&%^%^');

          let r = 0;
          for(let item of array) {

            if(item.rating.one == 0 && item.rating.two == 0 && item.rating.three == 0 && item.rating.four == 0 && item.rating.five == 0) {
              this.stars = "No ratings";
            }
            else {

              console.log("making the stars");

              totalPotential = item.rating.one * 5 + item.rating.two * 5 + item.rating.three * 5 + item.rating.four * 5 + item.rating.five * 5;
              ratings = item.rating.one + item.rating.two * 2 + item.rating.three * 3 + item.rating.four * 4 + item.rating.five *5;
              

              let i = (ratings / totalPotential) * 100;
              if(Math.round(i) <= 20) {
                this.stars = '\u2605';
              }
              if(Math.round(i) > 20 && Math.round(i) <= 40) {
                this.stars = '\u2605\u2605';
              }
              if(Math.round(i) > 40 && Math.round(i) <= 60) {
                this.stars = '\u2605\u2605\u2605';
              }
              if(Math.round(i) > 60 && Math.round(i) <= 80) {
                this.stars = '\u2605\u2605\u2605\u2605';
              }
              if(Math.round(i) > 80) {
                this.stars = '\u2605\u2605\u2605\u2605\u2605';
              }
            }

            item.stars = this.stars;
            this.rating.push(item);
            //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');
            r++;
          }

          console.log("THIS IS THE SORTED ARRAY TO BE SOthis.rrrED        " + JSON.stringify(this.rating));

          this.rating.sort(function(a,b){ 
            if(a.stars !== "No ratings" && b.stars !== "No ratings") {
              if(a.stars === b.stars){
                return 0;
              }
              else {
                return a.stars.length < b.stars.length ? 1 : -1;
              }
            }
            else {
              if(a.stars === "No ratings"){
                return 1;
              }
              else if(b.stars === "No ratings"){
                return -1;
              }
            }

          });

          //this.loadDistances().then(() => {
           

          this.loadDistances();
          this.loadPrices();
       //});

          setTimeout(() => {
            console.log("in load availabilities ......... ")
            console.log(JSON.stringify(this.availabilities));

            this.availabilities.sort(function(a,b) {
              return Date.parse('01/01/2013 '+a.time) - Date.parse('01/01/2013 '+b.time);
            });

            console.log('*****previous******');
            console.log(JSON.stringify(this.availabilities));
            console.log('*****sorted********');
            
            for(let i of this.availabilities) {
              console.log(i.time + "          this is itime");
              let date = new Date('01/01/2013 ' + i.time);
              console.log(date + "          this is date in idate");
              let str = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
              console.log(str);
              i.time = str;
            }
          }, 1500);
          
       });   

      
              



    
    ////this.renderer.setElementStyle(this.promos.nativeElement, 'color', '#e6c926');
    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'block');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');

    /*setTimeout(() => {
      this.loadDistances();
    },1000)*/
    
  }

  presentProfileModal(salon, time) {
    let profileModal = this.modalCtrl.create(PopUp, { salon: salon, time: time});
    profileModal.present();
  }

  presentProfileModalDistance(salon) {
    let profileModal = this.modalCtrl.create(PopUpOther, { salon: salon });
    profileModal.present();
  }

  presentProfileModalRatings(salon) {
    let profileModal = this.modalCtrl.create(PopUpOther, { salon: salon });
    profileModal.present();
  }

  presentProfileModalPrice(salon) {
    let profileModal = this.modalCtrl.create(PopUpOther, { salon: salon });
    profileModal.present();
  }

  toolClicked(event) {
    this.toolbarClicks++;
    console.log('tapped');

    
    if(this.toolbarClicks == 1) {
      setTimeout(() => {
        if(this.toolbarClicks == 2) {
          console.log('running application');
          this.downState = (this.downState == 'notDown') ? 'down' : 'notDown';
          this.moveState = (this.moveState == 'up') ? 'down' : 'up';
          this.toolbarState = (this.toolbarState == 'up') ? 'down' : 'up';
          if(this.toolbarState == 'up') {
            this.config = {
              direction: 'horizontal',
              slidesPerView: '4',
              keyboardControl: false
            };

            this.swiperSize = 'small';

          }
          else {
            this.config = {
              direction: 'horizontal',
              slidesPerView: '1',
              keyboardControl: false
            };

            this.swiperSize = 'big';

            
          }
          this.toolbarClicks = 0;
        }
        else {
          this.toolbarClicks = 0;
        }
      }, 300)
    }
  }

  switchView() {
    this.navCtrl.push(FeedStylist);
  }

  closeMenu() {
    if(this.showDropDown == 'down' || this.showDropDownHeight == 'down') {
      this.showDropDown = 'up';
      this.showDropDownHeight = 'up';
    }
    else {
      //
    }
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', 'gray');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', '#e6c926');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');

    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'block');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');


  }

  closeMenuP() {
    if(this.showDropDown == 'down' || this.showDropDownHeight == 'down') {
      this.showDropDown = 'up';
      this.showDropDownHeight = 'up';
    }
    else {
      //
    }
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'block');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'none');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', '#e6c926');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');

    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');


  }

  dropDown() {
 
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');
    
    if(this.downState == 'down') {
      this.showDropDownHeight = (this.showDropDownHeight == 'up') ? 'down' : 'up';
    }
    else {
      this.showDropDown = (this.showDropDown == 'up') ? 'down' : 'up';
    }
  }

  dropDownD() {
    this.renderer.setElementStyle(this.elRef.nativeElement.querySelector('.scroll-content'), 'margin-top', '8%');
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', '#e6c926');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'block');


    this.changeText.nativeElement.innerHTML = "Distance";
    this.dropDown();
  }

  dropDownA() {
    

    this.changeText.nativeElement.innerHTML = "Availability";
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', '#e6c926');
    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'block');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');


    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');


    this.dropDown();
  }

  dropDownP() {

    this.changeText.nativeElement.innerHTML = "Price";
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', '#e6c926');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');
    this.renderer.setElementStyle(this.elRef.nativeElement.querySelector('.scroll-content'), 'margin-top', '6%');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'block');
    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'none');

    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');

    //setTimeout(() => {
      //this.renderer.setElementStyle(this.elRef.nativeElement.querySelector('.scroll-content'), 'margin-top', '-47%');
    //}, 1000);

    this.dropDown();
  }

  dropDownR() {
    this.changeText.nativeElement.innerHTML = "Rating";
    this.renderer.setElementStyle(this.elRef.nativeElement.querySelector('.scroll-content'), 'margin-top', '6%');
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', '#e6c926');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');
    
    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'block');
    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');


    this.dropDown();
  }

  gotoProfile() {
    this.navCtrl.push(StylistProfile);
  }

  onScroll(event) {
    console.log(event);
  }

  loadAvailabilities() {

    //return new Promise((resolve, reject) => {
      this.appointments = this.af.list('/appointments', { query: {
        orderByChild: 'selected',
        limitToFirst: 10
      }});

      let promises = [];
      let i2 = 0;
      
      this.subscription2 = this.appointments.subscribe(items => {
        this.startAtKey5 = items[items.length - 1].$key;
        this.lastKey5 = this.startAtKey5;
        items.forEach(item => {
        promises.push(new Promise((resolve, reject) => {
          console.log(item);
          let userName = item.$key;
          let i1 = 0;
          for(let month in item) {

            this.appointmentsMonth = this.af.list('/appointments/' + userName + '/' + month);
            this.subscription3 = this.appointmentsMonth.subscribe(items => items.forEach(item => {
              promises.push(new Promise((resolve, reject) => {
                this.startAtKeyAvail = item.$key;
                //console.log(JSON.stringify(item) + "           item");
                let date = new Date(item.date.day * 1000);
                let today = new Date();
                console.log(date.getMonth() + "==" + today.getMonth()  + "&&" + date.getDate() + "==" + today.getDate());
                console.log("IN LOAD AVAILABILITIES *(*((**(*(*(*(*(*(*&^^^^%^%556565656565");
                if(date.getMonth() == today.getMonth() && date.getDate() == today.getDate()) {
                  console.log("            inside the if that checks if its today");
                  console.log(item.reserved.appointment + "                *************appointment");
                  //let counter = 0;
                  //mapped = item.reserved.appointment.map((r) => {
                  //item.reserved.appointment.forEach((r, index) => {
                    for(let r of item.reserved.appointment) {
                      promises.push(new Promise((resolve, reject) => {
                        if(r.selected == true) {
                          //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');

                          let storageRef = firebase.storage().ref().child('/settings/' + userName + '/profilepicture.png');
                           
                          let obj = {'pic':"", 'salon': userName, 'time': r.time};

                          storageRef.getDownloadURL().then(url => {
                            console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
                            obj.pic = url;
                            this.availabilities.push(obj);
                            console.log(JSON.stringify(this.availabilities));
                            resolve();
                          }).catch((e) => {
                            console.log("in caught url !!!!!!!$$$$$$$!!");
                            obj.pic = 'assets/blankprof.png';
                            this.availabilities.push(obj);
                            console.log(JSON.stringify(this.availabilities));
                            resolve();
                          });
                        }
                      }))
                      
                  }

                }

               }))
              if(i1 == items.length - 1) {
                resolve()
              }
              

              i1++;
              }))
             }
             if(i2 == items.length - 1) {
                resolve()
             }
              

             i2++;
          }))
          })
        });

        Promise.all(promises).then(() => {
          console.log("in load availabilities ......... ")
          console.log(JSON.stringify(this.availabilities));

          this.availabilities.sort(function(a,b) {
            return Date.parse('01/01/2013 '+a.time) - Date.parse('01/01/2013 '+b.time);
          });

          console.log('*****previous******');
          console.log(JSON.stringify(this.availabilities));
          console.log('*****sorted********');
          
          for(let i of this.availabilities) {
            console.log(i.time + "          this is itime");
            let date = new Date('01/01/2013 ' + i.time);
            console.log(date + "          this is date in idate");
            let str = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
            console.log(str);
            i.time = str;
          }
        });
      //}))

      
        
    //})
    
  }

  

  setDateTime(time) {
    let date = new Date();
    let index = time.indexOf(":"); // replace with ":" for differently displayed time.
    let index2 = time.indexOf(" ");

    let hours = time.substring(0, index);
    let minutes = time.substring(index + 1, index2);

    var mer = time.substring(index2 + 1, time.length);

    console.log(mer + "        *******AMPM");

    if (mer == "PM") {
        console.log(hours + "        ())()()(()hours before(()()(");
        let number = parseInt(hours) + 12;
        hours = number.toString();
        console.log(hours + "      **********hours after*******");
    }


    date.setHours(hours);
    date.setMinutes(minutes);

    return date;
  }



  getInitialImages() {


     

    

        /*.then(array => {
        setTimeout(() => {
          console.log(JSON.stringify(array) + " :FOSIEJO:SFJ::EFIJSEFIJS:EFJS:IO THIS IODIOSJ:FDSIJ :DIS");
          //
            
          //}, 1000)
          
        }, 2000);*/
          
      //})
  }

  /*doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    console.log(this.content.directionY + "        upupupupupupu********");
    if(this.content.directionY == 'up') {
      this.show = false
    }
    else {
      this.show = true;
    }


    //return new Promise((resolve, reject) => {
    setTimeout(() => {


      console.log(this.startAtKey + "     before %%^&^&^% start at");
      this.list = this.af.list('/promos', {
      query: {
        orderByKey: true,
        endAt: this.startAtKey,
        limitToLast: 11
      }});

      this.list.subscribe(items => { 
          let x = 0;
          this.lastKey = this.startAtKey;
          items.forEach(item => {


            let storageRef = firebase.storage().ref().child('/settings/' + item.customMetadata.username + '/profilepicture.png');
                       
            storageRef.getDownloadURL().then(url => {
              console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
              item.customMetadata.picURL = url;
            }).catch((e) => {
              console.log("in caught url !!!!!!!$$$$$$$!!");
              item.customMetadata.picURL = 'assets/blankprof.png';
            });
            
            if(this.startAtKey !== item.$key && this.lastKey !== item.$key) {
              console.log(this.startAtKey + "   :startatkey before 4444444        item key:     " + item.$key);
              this.items.push(item.customMetadata);
            }

            if(x == 0) {
              this.startAtKey = item.$key;
            }

            x++;
          });          
          
      })

      infiniteScroll.complete(); 
        
      }, 500);

  }*/

}