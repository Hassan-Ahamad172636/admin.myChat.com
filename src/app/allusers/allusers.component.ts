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

  addedFriendIds = new Set<string>(); // ✅ tracks newly added users (and stored locally)

  loadingLottie: any = {
    path: 'https://lottie.host/19df0d1b-1e15-4203-8b64-9270de80222b/4GSb8yUBxM.json',
  };

  notFoundLottie: any = {
    path: 'https://lottie.host/99a22a5c-8b2c-4cc1-a8db-4c070a3f1d0e/vTDbkx0MJM.json',
  };

  constructor(private userService: UserService) {
    this.loadAddedFriendIds(); // 🔁 load from localStorage
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

  loggedInUserId = this.getUserIdFromToken();

  fetchUsers() {
    this.userService.getAllUser().subscribe(
      (res: any) => {
        const allUsers = res.data.users;
        this.users = allUsers.filter(
          (user: any) => user._id !== this.loggedInUserId
        );
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
    return (
      user.friends?.some((friend: any) => friend._id === this.loggedInUserId) ||
      this.addedFriendIds.has(user._id)
    );
  }

  addUser(id: string) {
    if (this.addedFriendIds.has(id)) return;

    this.addedFriendIds.add(id);
    this.saveAddedFriendIds(); // ✅ save to localStorage

    const userId = this.getUserIdFromToken();
    const payload = {
      friends: id,
      userId: userId,
    };

    this.userService.addFriend(payload).subscribe({
      next: () => {
        console.log('Friend added:', id);
      },
      error: (err) => {
        console.error('Add friend failed', err);
      },
    });
  }

  // ✅ Save Set to localStorage
  saveAddedFriendIds() {
    localStorage.setItem(
      'addedFriendIds',
      JSON.stringify([...this.addedFriendIds])
    );
  }

  // ✅ Load Set from localStorage
  loadAddedFriendIds() {
    const stored = localStorage.getItem('addedFriendIds');
    if (stored) {
      try {
        this.addedFriendIds = new Set(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse addedFriendIds from localStorage', e);
        this.addedFriendIds = new Set();
      }
    }
  }

  // ✅ Live filtering
  ngDoCheck() {
    this.filteredUsers = this.users.filter((user) =>
      user.fullName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
