import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { RequiredinfoPage } from '../pages/requiredinfo/requiredinfo';
import { WebIntent } from '@ionic-native/web-intent';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
//import { timestamp } from 'rxjs/operator/timestamp';
import { File } from '@ionic-native/file';
 import {  NavController } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
   rootPage:any = RequiredinfoPage;
  @ViewChild('myNav') nav: NavController
 // rootPage:any =TabsPage
  extras:any;
title:any='';
  nativepath: any;
  loading: any;
  constructor(public loadingController:LoadingController, public fileChooser:FileChooser,public file_:File,
    // public navCtrl:NavController,
    public filePath:FilePath,public webIntent: WebIntent,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {


    platform.ready().then(() => {
  // this.loading = this.loadingController.create({ content: "Logging in ,please wait..." });
  //   this.loading.present();
      statusBar.styleDefault();
      splashScreen.hide();
       this.ListenForIntent()
    // this.loading.dismiss();
    });

  }

  ListenForIntent()
  {

(<any>window).plugins.intentShim.onIntent( (intent)=> {

  console.log('Received Intent>>>>>>>>>>: ' + JSON.stringify(intent.extras));
/** title Begin */
var a:any =intent.extras;
console.log(a); var output = '';

for (var property in a) {
  output += property + ': ' + a[property]+'; ';
}

var s = output.split('@');
var ss=s[0].split('/').pop();
this.title=ss;
console.log(this.title+' :** title optimize')
//alert(ss);
/** title End */

  let bb=intent.extras;
   let vdvd=bb["android.intent.extra.STREAM"];
  //console.log("BdfgvdfgvfdvB",vdvd["0"])
   this.OnFileEntry(vdvd["0"])

},errr=> console.log("intent error",errr));

  }

  captureFile(value) {
  let path='uri='+value
    this.filePath.resolveNativePath(path).then((result) => {
      this.nativepath = result;
     // console.log("nativepath",this.nativepath)
       }
    )
  }

 OnFileEntry(file){
 this.file_.resolveLocalFilesystemUrl(file).then((fileurl:any)=>{
  //console.log(" write",fileurl);


  fileurl.file((resFile) => {
    var reader = new FileReader();
    reader.readAsArrayBuffer(resFile);
    reader.onloadend = (evt: any) => {
      var ChatPath = new Blob([evt.target.result], { type: 'text/plain'});
     // console.log("ChatPath",ChatPath);


    this.nav.setRoot(RequiredinfoPage,{data:ChatPath,ctitle:this.title})

    }
  })
}).catch(err=>{  console.log("Err in write",err);

})
  }

}
