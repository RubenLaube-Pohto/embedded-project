import { Injectable, isDevMode } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {

    private host: string;

    constructor(
        private http: Http,
        private router: Router
    ) {
        if (isDevMode()) {
            this.host = 'http://localhost:3000';
        } else {
            this.host = 'https://jamk-iot-angular-backend.eu-gb.mybluemix.net';
        }
    }

    private getOptions(): RequestOptions {
        let headers = new Headers({
             Authorization: 'JWT ' + localStorage.getItem('jwtToken')
        });
        let options = new RequestOptions({ headers: headers });

        return options;
    }

    isAuthenticated(): Observable<boolean> {
        let url = this.host + '/api/authenticated';

        return this.http.get(url, this.getOptions())
            .map(() => true)
            .catch(() => {
                this.router.navigate(['/login']);
                return Observable.of(false);
            });
    }

    login(username: string, password: string): Observable<any> {
        let url = this.host + '/api/login';
        let body = {
            username: username,
            password: password
        };

        return this.http.post(url, body)
            .map((res: Response) => res.json())
            .catch((error: Response | any) => {
                return Observable.throw('Login failed');
            });
    }

    getData(): Observable<any> {
        let url = this.host + '/api/test';

        return this.http.get(url, this.getOptions())
            .map((res: Response) => res.json())
            .catch((error: Response | any) => {
                return Observable.throw('Failed to get protected data');
            });
    }

}
