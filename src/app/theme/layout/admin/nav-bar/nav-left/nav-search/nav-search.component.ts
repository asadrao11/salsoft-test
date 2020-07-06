import { Component, OnInit, Directive, ElementRef, HostListener } from '@angular/core';
import * as screenfull from 'screenfull';

@Component({
  selector: 'app-nav-search',
  templateUrl: './nav-search.component.html',
  styleUrls: ['./nav-search.component.scss']
})
export class NavSearchComponent implements OnInit {
  public searchOn: boolean;

  constructor() {
    this.searchOn = false;
  }

  ngOnInit() { }

  clickFullScreen() {
    console.log("Got");
    // if (screenfull.isEnabled) {
    //   screenfull.request();
  // }
  }
}

