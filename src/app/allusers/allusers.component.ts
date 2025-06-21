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

  loadingLottie: any = {
    path: 'https://lottie.host/19df0d1b-1e15-4203-8b64-9270de80222b/4GSb8yUBxM.json',
  };

  notFoundLottie: any = {
    path: 'https://lottie.host/99a22a5c-8b2c-4cc1-a8db-4c070a3f1d0e/vTDbkx0MJM.json',
  };

  constructor(private userService: UserService) {
    this.fetchUsers();
  }

  getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.id || decodedPayload._id || null;
    } catch (error) {
      console.error('Token decoding failed:', error);
      return null;
    }
  }

  loggedInUserId = this.getUserIdFromToken(); // e.g., "6854d98f759f79c4444e39fd"

  fetchUsers() {
    this.userService.getAllUser().subscribe(
      (res: any) => {
        this.users = res.data.users;
        this.filteredUsers = this.users;
        this.loading = false;
      },
      (err: any) => {
        console.error('Error fetching users', err);
        this.loading = false;
      }
    );
  }

  isUserAlreadyFriend(user: any): boolean {
    const myId = this.loggedInUserId;
    return user.friends?.some((friend: any) => friend._id === myId);
  }
  

  addUser(id: any) {
    const userId = this.getUserIdFromToken();
    let payload = {
      friends: id,
      userId: userId,
    };

    this.userService.addFriend(payload).subscribe((resp: any) => {
      this.fetchUsers();
    });
  }

  // ngOnChanges() {
  //   this.filterUsers();
  // }

  // Live filtering
  ngDoCheck() {
    this.filteredUsers = this.users.filter((user) =>
      user.fullName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
