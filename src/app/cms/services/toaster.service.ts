import { Injectable } from '@angular/core';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(
    private toastyService: ToastyService
  ) { }



  addToast(options) {
    if (options.closeOther) {
      this.toastyService.clearAll();
    }
    const toastOptions: ToastOptions = {
      title: options.title,
      msg: options.msg,
      showClose: options.showClose,
      timeout: options.timeout ? options.timeout : 5000,
      theme: options.theme ? options.theme : 'default'
    };

    switch (options.type) {
      case 'default': this.toastyService.default(toastOptions); break;
      case 'info': this.toastyService.info(toastOptions); break;
      case 'success': this.toastyService.success(toastOptions); break;
      case 'wait': this.toastyService.wait(toastOptions); break;
      case 'error': this.toastyService.error(toastOptions); break;
      case 'warning': this.toastyService.warning(toastOptions); break;
    }
  }

}
