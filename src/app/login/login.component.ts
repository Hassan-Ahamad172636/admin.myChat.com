import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { SnackService } from '../services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private _userService: UserService,
    private router: Router,
    private snackbar: SnackService
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
    if(!this.userObj?.email || !this.userObj?.password) {
      this.snackbar.show("Please fill all required fields!", 'error');
      return
    }
    this._userService.loginUser(this.userObj).subscribe((resp: any) => {
      localStorage.setItem('token', resp.data.token)
      this.snackbar.show("User logged in successfully!", 'success');
      this.router.navigate(['/chat'])
    });
  }
}
