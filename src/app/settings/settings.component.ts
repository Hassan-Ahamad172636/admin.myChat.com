import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  isSidebarOpen = true;
  activeSection = 'status';

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
    // Implement your logic
  }
}
