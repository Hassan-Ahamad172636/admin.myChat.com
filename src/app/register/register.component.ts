import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SnackService } from '../services/snackbar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(
    private _userService: UserService,
    private router: Router,
    private toastr: ToastrService, // ✅ inject toastr
    private snackbar: SnackService
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
    if (
      !this.userObj.fullName ||
      !this.userObj.email ||
      !this.userObj.password
    ) {
      this.snackbar.show('Please fill in all fields.', 'warning');
      return;
    }

    this._userService.createUser(this.userObj).subscribe({
      next: (resp: any) => {
        this.snackbar.show('User registered successfully!', 'success');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        if (err.error?.message) {
          this.snackbar.show(err.error.message, 'error');
        } else {
          this.snackbar.show('Something went wrong. Please try again.', 'error');
        }
      },
    });
  }
}
