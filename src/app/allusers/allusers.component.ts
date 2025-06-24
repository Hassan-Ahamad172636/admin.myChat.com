import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-allusers',
  templateUrl: './allusers.component.html',
  styleUrls: ['./allusers.component.scss'],
})
export class AllusersComponent {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery: string = '';
  loading: boolean = true;
  currentUser: any;
  loggedInUserId: string | null = null;

  loadingLottie = {
    path: 'https://lottie.host/19df0d1b-1e15-4203-8b64-9270de80222b/4GSb8yUBxM.json',
  };

  notFoundLottie = {
    path: 'https://lottie.host/99a22a5c-8b2c-4cc1-a8db-4c070a3f1d0e/vTDbkx0MJM.json',
  };

  constructor(private userService: UserService) {
    this.loggedInUserId = this.getUserIdFromToken();
    this.fetchUsers();
    this.getById();
  }

  getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.id || decoded._id || null;
    } catch (e) {
      console.error('Token decode failed:', e);
      return null;
    }
  }

  getById() {
    if (!this.loggedInUserId) return;
    this.userService.getById(this.loggedInUserId).subscribe((resp: any) => {
      this.currentUser = resp.data?.user;
    });
  }

  fetchUsers() {
    this.userService.getAllUser().subscribe(
      (res: any) => {
        this.users = res.data.users.filter(
          (user: any) => user._id !== this.loggedInUserId
        );
        this.filteredUsers = this.users;
        this.loading = false;
      },
      (err) => {
        console.error('Error fetching users:', err);
        this.loading = false;
      }
    );
  }

  isUserAlreadyFriend(user: any): boolean {
    return this.currentUser?.friends?.some(
      (f: any) => f._id === user._id
    );
  }

  addUser(userIdToAdd: string) {
    if (this.isUserAlreadyFriend({ _id: userIdToAdd })) return;

    const payload = {
      friends: userIdToAdd,
      userId: this.loggedInUserId,
    };

    this.userService.addFriend(payload).subscribe({
      next: () => {
        this.getById(); // refresh current user friend list after add
        console.log('✅ Friend added successfully');
      },
      error: (err) => {
        console.error('❌ Add friend failed', err);
      },
    });
  }

  ngDoCheck() {
    this.filteredUsers = this.users.filter((user) =>
      user.fullName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
