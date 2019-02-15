import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, NavController } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

 import { DatabaseProvider } from '../providers/database/database';
//  import { SQLite } from '@ionic-native/sqlite/ngx';
import { SQLite} from '@ionic-native/sqlite';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { LocalDataReaderProvider } from '../providers/local-data-reader/local-data-reader';

import {HttpModule} from '@angular/http';
import { RequiredinfoPage } from '../pages/requiredinfo/requiredinfo';
import { File} from '@ionic-native/file';
// import { RequiredinfoPageModule } from '../pages/requiredinfo/requiredinfo.module';
import { WebIntent } from '@ionic-native/web-intent';
import { SocialSharing } from '@ionic-native/social-sharing';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,RequiredinfoPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    // RequiredinfoPageModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,RequiredinfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatabaseProvider,SQLite,FileChooser,FileOpener,FilePath,File,
     SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocalDataReaderProvider,WebIntent
  ]
})
export class AppModule {}
