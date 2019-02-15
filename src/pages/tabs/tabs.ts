import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { RequiredinfoPage } from '../requiredinfo/requiredinfo';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = RequiredinfoPage;
  tab2Root = HomePage;
  tab3Root = ContactPage;

  constructor() {

  }
}
