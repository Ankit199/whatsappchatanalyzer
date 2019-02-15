import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MydashboardPage } from './mydashboard';

@NgModule({
  declarations: [
    MydashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(MydashboardPage),
  ],
})
export class MydashboardPageModule {}
