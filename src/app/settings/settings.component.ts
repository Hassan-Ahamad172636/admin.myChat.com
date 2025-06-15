import { Component } from '@angular/core';
import { Navigation, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  constructor(
    private router: Router
  ) {}
  isSidebarOpen = true;
  activeSection = 'status';

  statusLottieOptions: any = {
    path: 'https://assets4.lottiefiles.com/packages/lf20_j1adxtyb.json', // Replace with your desired Lottie animation
  };

  logoutLottieOptions: any = {
    path: 'https://assets4.lottiefiles.com/packages/lf20_0yfsb3a1.json',
  };

  userName: any;
  userEmail: any;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  changeProfileImage() {
    // Implement your logic
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
    // Implement your logic
  }
}
