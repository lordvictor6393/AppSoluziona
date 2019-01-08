import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";
import * as SZ from "../globalConstants";

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const user = this.authService.loggedUserInstance;
        const allowed = user && user.id && user.roles[SZ.SUPERADMIN];
        if(!allowed) {
            this.router.navigate(['/fundingRequests']);
        }
        return allowed;
    }
}