import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private http: Http
    ) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let headers = new Headers({ Authorization: 'JWT ' + this.getToken() });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('http://localhost:3000/api/authenticated', options)
            .map(() => true)
            .catch(() => {
                this.router.navigate(['/login']);
                return Observable.of(false);
            });
    }

    setToken(token: string) {
        if (token) {
            localStorage.setItem('jwtToken', token);
        } else {
            localStorage.removeItem('jwtToken');
        }
    }

    getToken() {
        return localStorage.getItem('jwtToken');
    }

}
