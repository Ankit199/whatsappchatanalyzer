import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  value: any;
mychats:any[]=[];
  constructor(public navCtrl: NavController,public navParams:NavParams) {
    this.value = navParams.get('value');


    // console.log(">>>>>>>>>>>>>All Arrays>>>>>>>>>>>",this.value);

    // for(let i=0;i<this.value.lenght;i++)
    // {
    //  // console.table(JSON.parse(r[1].groupdata));
    //    this.mychats.push(JSON.parse(this.value[i].info))
    //   console.log("Grrrrrrrrrrrr",this.mychats);
    // }


  }

}
