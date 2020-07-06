import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private http: HttpClient,
  ) { }

  public AllUsers = [];

  async getAllUsers() {
    return await this.http.get(`${environment.host}dashboard/getUsers`).subscribe((res : any) => {
      if(res.success) {
        this.AllUsers = res.data;
      }
    })
  }

}