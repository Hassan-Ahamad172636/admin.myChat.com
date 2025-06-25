import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { ChatService } from '../services/chat.service';
import { SocketService } from '../services/socket.service';
import { jwtDecode } from 'jwt-decode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  isMobileView: boolean = false;
  showChat: boolean = false;
  selectedUser: any = null;
  checkScreenSize() {
    this.isMobileView = window.innerWidth <= 768;
    if (!this.isMobileView) {
      this.showChat = false;
    }
  }

  onUserClick(user: any) {
    this.selectedUser = user;
    console.log(user);

    this.conversationId = 'dummyId'; // replace with real
  }

  lottieOptions: any = {
    path: 'https://assets2.lottiefiles.com/packages/lf20_tll0j4bb.json', // 👈 You can change Lottie here
  };

  lottieSecondOptions: any = {
    path: '../../assets/Animation - 1749436448592.json',
    autoplay: true,
    loop: true,
  };

  currentUserId: any;
  users: any;
  chats: any[] = [];
  message: any;
  conversationId: any;
  messages: any = []; // Initialize empty array
  username: any;
  isChatOpenOnMobile = false;

  openChatOnMobile(userName: string) {
    this.isChatOpenOnMobile = true;
    this.selectedUser = userName;
  }

  closeChatOnMobile() {
    this.isChatOpenOnMobile = false;
    this.selectedUser = '';
  }
  searchQuery: string = '';
  filteredFriends: any[] = []; // filtered list for display

  private socketSub!: Subscription;

  constructor(
    private _userService: UserService,
    private _chatService: ChatService,
    private socketService: SocketService
  ) {}

  joinMyRooms() {
    if (this.conversationId) {
      this._chatService.getMessages(this.conversationId).subscribe({
        next: (res: any) => {
          const allRooms = res.data || [];
          for (const conv of allRooms) {
            this.socketService.joinRoom(conv._id);
          }
        },
        error: (err) => {
          console.error('❌ Failed to join rooms', err);
        },
      });
    }
  }

  ngOnInit() {
    this.getUserIdFromToken();
    this.getAllUser();
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));

    // ✅ Notify backend: user is online
    this.socketService.notifyUserOnline(this.currentUserId);

    // ✅ Listen to online/offline status
    this.socketService.onUserStatusChange().subscribe(({ userId, status }) => {
      const isOnline = status === 'online';

      this.filteredFriends = this.filteredFriends.map((friend) =>
        friend._id === userId ? { ...friend, isOnline } : friend
      );

      this.users.friends = this.users.friends.map((friend: any) =>
        friend._id === userId ? { ...friend, isOnline } : friend
      );

      if (this.selectedUser && this.selectedUser._id === userId) {
        this.selectedUser = { ...this.selectedUser, isOnline };
      }
    });

    this.joinMyRooms();

    this.socketSub = this.socketService.onMessage().subscribe((msg: any) => {
      console.log('📥 New socket message received:', msg);

      if (msg.conversationId === this.conversationId) {
        this.messages = [...this.messages, msg];
      }
    });
  }

  ngOnDestroy() {
    if (this.socketSub) {
      this.socketSub.unsubscribe();
    }

    if (this.conversationId) {
      this.socketService.leaveRoom(this.conversationId);
    }

    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = (jwtDecode as any).default
          ? (jwtDecode as any).default(token)
          : (jwtDecode as any)(token);
        this.currentUserId = decodedToken.id;
      } catch (error) {
        console.error('Invalid token');
      }
    }
  }

  getAllUser() {
    this._userService.getById(this.currentUserId).subscribe({
      next: (resp: any) => {
        this.users = resp.data.user || {};
        this.filteredFriends = this.users.friends || [];
      },
      error: (err) => {
        console.error('Error fetching users', err);
      },
    });
  }

  onSearchChange() {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredFriends = this.users.friends.filter((friend: any) =>
      friend.fullName.toLowerCase().includes(query)
    );
  }

  createConversation(receiverId: string) {
    if (this.isMobileView) {
      this.showChat = true;
    }

    this._chatService.conversation({ receiverId }).subscribe({
      next: (res: any) => {
        this.conversationId = res?.data?.conversation?._id;

        // Determine who is the OTHER user (receiver)
        const conversation = res.data.conversation;
        const otherUser =
          conversation.senderId._id === this.currentUserId
            ? conversation.receiverId
            : conversation.senderId;

        this.selectedUser = otherUser; // ✅ store full user info (name, photo)

        this.getMessages();
        this.socketService.joinRoom(this.conversationId);
      },
      error: (err) => {
        console.error('Failed to create conversation', err);
      },
    });
  }

  getMessages() {
    this._chatService
      .getMessages({ conversationId: this.conversationId })
      .subscribe((resp: any) => {
        this.messages = resp.data.messages;
      });
  }

  sendMessage() {
    if (!this.message?.trim()) return;

    this._chatService.send(this.conversationId, this.message).subscribe({
      next: () => {
        this.message = '';
      },
      error: (err) => {
        console.error('Failed to send message:', err);
      },
    });
  }
}
