import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'app/auth.guard';
import { Router } from '@angular/router';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    constructor(
        private auth: AuthGuard,
        private router: Router,
        private http: Http
    ) {}

    ngOnInit() {}

    logout() {
        this.auth.setToken(null);
        this.router.navigateByUrl('/login');
    }

    getData() {
        let headers = new Headers({
            'Authorization': 'JWT ' + this.auth.getToken()
        });
        let options = new RequestOptions({
            headers: headers
        });
        this.http.get('http://localhost:3000/api/test', options)
            .map((res: Response) => res.json())
            .catch((error: Response | any) => Observable.throw('Failed to get protected data'))
            .subscribe(
                res => console.log(res),
                error => console.log(error)
            );
    }

}
