import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NurseryGuardService implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    if (sessionStorage.getItem('number') == "2" && sessionStorage.getItem('userId'))
      return true
    else {
      this.router.navigate(['/']);
      return false
    }
  }
}
