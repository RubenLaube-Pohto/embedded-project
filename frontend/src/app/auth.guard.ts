import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ApiService } from 'app/api.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private api: ApiService) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.api.isAuthenticated();
    }

    setToken(token: string): void {
        if (token) {
            localStorage.setItem('jwtToken', token);
        } else {
            localStorage.removeItem('jwtToken');
        }
    }

    getToken(): string {
        return localStorage.getItem('jwtToken');
    }

}
