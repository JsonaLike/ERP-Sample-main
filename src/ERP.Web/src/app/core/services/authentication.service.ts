import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class AuthenticationService {
    constructor(private cookieService: CookieService){}
    public getCurrentUser(): any {
        var user = this.cookieService.get('currentUser');
        if (!user) {
            return null;
        }
        return JSON.parse(user);
    }

    public removeCurrentUser(): void {
        this.cookieService.delete('currentUser');
    }

    public setCurrentUser(user: any): void {
        this.cookieService.set('currentUser', JSON.stringify(user),300);
    }

    public isAuhenticated(): boolean {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            return true;
        }
        return false;
    }
}