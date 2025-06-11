import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(
    private _userService: UserService,
    private router: Router
  ) {}

  lottieOptions: any = {
    path: '../../assets/Animation - 1749228295411.json',
    autoplay: true,
    loop: true,
  };

  userObj: any = {
    fullName: '',
    email: '',
    password: '',
  };

  createUser() {
    this._userService.createUser(this.userObj).subscribe((resp: any) => {
      this.router.navigate(['/login'])
    });
  }
}
