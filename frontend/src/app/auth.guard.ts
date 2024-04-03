import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.isLoggedIn().pipe(
      map((data: any) => {
        if (data.role === 'admin') {
          console.log('Role is admin: ' + data.role);
          return true; 
        } else {
          console.log('Role is not admin: ' + data.role);
          this.router.navigate(['/']); 
          return false;
        }
      })
    );
  }
}
