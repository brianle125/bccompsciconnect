import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class sessionGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.isLoggedIn().pipe(
      map((data: any) => {
        const username = route.paramMap.get('username');
        if (data.user === username || data.role === 'admin') {
          console.log('The session user can edit')
          return true; 
        } else {
          console.log('Cannot edit another profile')
          this.router.navigate(['/']); 
          return false;
        }
      })
    );
  }
}
