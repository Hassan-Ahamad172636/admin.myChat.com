import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  user: any;
  userId: any;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isSidebarOpen = true;
  activeSection = 'status';
  userName: any;
  userEmail: any;

  statusLottieOptions: any = {
    path: 'https://assets4.lottiefiles.com/packages/lf20_j1adxtyb.json',
  };

  logoutLottieOptions: any = {
    path: 'https://assets4.lottiefiles.com/packages/lf20_0yfsb3a1.json',
  };

  constructor(private router: Router, private userService: UserService) {
    this.getUserIdFromToken();
    this.userService.getById(this.userId).subscribe((resp: any) => {
      this.user = resp?.data?.user;
      this.userName = this.user?.fullName;
      this.userEmail = this.user?.email;
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedImage);

      this.uploadProfileImage(this.selectedImage);
    }
  }

  getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = (jwtDecode as any).default
          ? (jwtDecode as any).default(token)
          : (jwtDecode as any)(token);
        this.userId = decodedToken.id;
      } catch {}
    }
  }

  uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append('profilePhoto', file);
    this.userService
      .updateProfile(this.userId, formData)
      .subscribe((resp: any) => {});
  }
    
  saveProfileChanges() {
    const formData = new FormData();
    if (this.selectedImage) {
      formData.append('profilePhoto', this.selectedImage);
    }
    formData.append('fullName', this.userName);
    formData.append('email', this.userEmail);
  
    this.userService.updateProfile(this.userId, formData).subscribe((resp: any) => {
      // handle success
    });
  }
  

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
