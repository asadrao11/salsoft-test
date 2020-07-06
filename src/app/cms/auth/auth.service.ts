import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToasterService } from '../services/toaster.service';
import { AuthSigninComponent } from '../pages/auth-signin/auth-signin.component';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  endpoint: string = environment.host;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router,
    private toaster: ToasterService, 
  ) { }

  signIn(user) {
    this.http.post<any>(`${this.endpoint}login`, user)
      .subscribe((res: any) => {
        if (res.success) {
          localStorage.setItem('access_token', res.access_token.token);
          localStorage.setItem('user', res.user.id);
          this.getUserProfile(res.user.id).subscribe((res) => {
            this.currentUser = res;
            this.toaster.addToast({ title: 'Success', msg: "Login Successful", type: 'success' });
            this.router.navigate(['public']);
          });
        } else {
          this.toaster.addToast({ title: 'Error', msg: res.message, type: 'error' });
          AuthSigninComponent.submitLoader = false;
        }
      });
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  doLogout() {
    this.toaster.addToast({ title: 'Logout', msg: "Logging out...", type: 'wait' })
    let removeToken = localStorage.removeItem('access_token');
    localStorage.clear();
    if (removeToken == null) {
      this.router.navigate(['login']);
    }
  }

  // User profile
  getUserProfile(id): Observable<any> {
    let api = `${this.endpoint}user/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  // Error 
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    this.toaster.addToast({ title: 'Error', msg: msg, type: 'error' });
    return throwError(msg);
  }
}