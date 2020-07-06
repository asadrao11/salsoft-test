import {Directive, ElementRef, HostListener} from '@angular/core';

import * as screenfull from 'screenfull';
import { Screenfull } from 'screenfull';

@Directive({
  selector: '[appToggleFullScreen]'
})
export class ToggleFullScreenDirective {
  constructor(private elements: ElementRef) {}

  @HostListener('click')
  onClick() {
    /*if (screenfull.enabled) {
      (this.elements).nativeElement.querySelector('.feather').classList.toggle('icon-maximize');
      (this.elements).nativeElement.querySelector('.feather').classList.toggle('icon-minimize');
      screenfull.toggle();
    }*/
    console.log("Got");

    if (isScreenFull(screenfull)) {
      if (screenfull.isFullscreen) {
        console.log("Got");
        screenfull.exit();
      } else {
        screenfull.request();
      }
    }
  }
}

function isScreenFull(sf: Screenfull | false): sf is Screenfull {
  return (sf as Screenfull).isFullscreen;
}
