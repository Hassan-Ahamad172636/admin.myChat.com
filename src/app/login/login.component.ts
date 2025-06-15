import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private _userService: UserService,
    private router: Router
  ) {}
  loginData: any = {
    email: '',
    password: '',
  };

  loginUser() {
    // functionality tum add kar lena
  }
  lottieOptions: any = {
    path: '../../assets/Animation - 1749186681163.json',
    autoplay: true,
    loop: true,
  };

  userObj: any = {
    email: '',
    password: '',
  };

  login() {
    this._userService.loginUser(this.userObj).subscribe((resp: any) => {
      localStorage.setItem('token', resp.data.token)
      this.router.navigate(['/chat'])
    });
  }
}
