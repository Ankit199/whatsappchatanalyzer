import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
/**
 * Generated class for the MydashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mydashboard',
  templateUrl: 'mydashboard.html',
})
export class MydashboardPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public databaseProvider:DatabaseProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MydashboardPage');
    // this.databaseProvider.createGroupInfoTable();
  }

}
