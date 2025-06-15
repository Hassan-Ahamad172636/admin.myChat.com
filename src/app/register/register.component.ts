import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(
    private _userService: UserService,
    private router: Router,
    private toastr: ToastrService // ✅ inject toastr
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
    // ✅ Validate fields first (optional but helpful)
    if (!this.userObj.fullName || !this.userObj.email || !this.userObj.password) {
      this.toastr.warning('Please fill in all fields.', 'Missing Info');
      return;
    }

    this._userService.createUser(this.userObj).subscribe({
      next: (resp: any) => {
        this.toastr.success('User registered successfully!', 'Success');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        if (err.error?.message) {
          this.toastr.error(err.error.message, 'Error');
        } else {
          this.toastr.error('Something went wrong. Please try again.', 'Error');
        }
      },
    });
  }
}
