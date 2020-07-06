import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject'
import { ToasterService } from './toaster.service';

export class PendingRequest {
  url: string;
  body: string;
  subscription: Subject<any>;

  constructor(url: string, body: any, subscription: Subject<any>) {
    this.url = url;
    this.body = body;
    this.subscription = subscription;
  }
}
@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private requests$ = new Subject<any>();
  private queue: PendingRequest[] = [];

  constructor(
    private httpClient: HttpClient,
    private toastr: ToasterService,
  ) { this.requests$.subscribe(request => this.execute(request)); }

  invokePost(url, body) {
    return this.addRequestToQueue(url, body);
  }

  private addRequestToQueue(url, body) {
    const sub = new Subject<any>();
    const request = new PendingRequest(url, body, sub);
    this.queue.push(request);
    if (this.queue.length === 1) {
      this.startNextRequest();
    }
    return sub;
  }

  private execute(requestData) {
    try {
      const req = this.httpClient.post(requestData.url, requestData.body)
        .subscribe(res => {
          const sub = requestData.subscription;
          sub.next(res);
          this.queue.shift();
          this.startNextRequest();
        });
    } catch (e) {
      this.toastr.addToast({ title: 'Error', msg: e.message, type: 'error' });
    }
  }

  private startNextRequest() {
    if (this.queue.length > 0) {
      this.execute(this.queue[0]);
    }
  }
}