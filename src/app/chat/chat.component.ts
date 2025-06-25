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
  currentUserId: any;
  users: any;
  chats: any[] = [];
  message: any;
  conversationId: any;
  messages: any = [];
  username: any;
  isChatOpenOnMobile = false;
  searchQuery: string = '';
  filteredFriends: any[] = [];

  private socketSub!: Subscription;
  private onlineSub!: Subscription;

  lottieOptions: any = {
    path: 'https://assets2.lottiefiles.com/packages/lf20_tll0j4bb.json',
  };

  lottieSecondOptions: any = {
    path: '../../assets/Animation - 1749436448592.json',
    autoplay: true,
    loop: true,
  };

  constructor(
    private _userService: UserService,
    private _chatService: ChatService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.getUserIdFromToken();
    this.getAllUser();
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));

    // 🟢 Emit current user to backend
    this.socketService.emitUserConnected(this.currentUserId);

    // 🟢 Listen for online users update
    this.onlineSub = this.socketService
      .listenOnlineUsers()
      .subscribe((onlineIds: string[]) => {
        this.updateFriendsOnlineStatus(onlineIds);
      });

    // 🟢 Join my rooms (you can improve logic later)
    this.joinMyRooms();

    // 🟢 Listen for messages
    this.socketSub = this.socketService.onMessage().subscribe((msg: any) => {
      if (msg.conversationId === this.conversationId) {
        this.messages = [...this.messages, msg];
      }
    });
  }

  ngOnDestroy() {
    if (this.socketSub) this.socketSub.unsubscribe();
    if (this.onlineSub) this.onlineSub.unsubscribe();
    if (this.conversationId) this.socketService.leaveRoom(this.conversationId);
  }

  checkScreenSize() {
    this.isMobileView = window.innerWidth <= 768;
    if (!this.isMobileView) this.showChat = false;
  }

  onUserClick(user: any) {
    this.selectedUser = user;
    this.conversationId = 'dummyId';
  }

  openChatOnMobile(userName: string) {
    this.isChatOpenOnMobile = true;
    this.selectedUser = userName;
  }

  closeChatOnMobile() {
    this.isChatOpenOnMobile = false;
    this.selectedUser = '';
  }

  getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = (jwtDecode as any).default
          ? (jwtDecode as any).default(token)
          : (jwtDecode as any)(token);
        this.currentUserId = decodedToken.id;
      } catch {
        console.error('Invalid token');
      }
    }
  }

  getAllUser() {
    this._userService.getById(this.currentUserId).subscribe({
      next: (resp: any) => {
        this.users = resp.data.user || {};
        this.filteredFriends = (this.users.friends || []).map((f: any) => ({
          ...f,
          isOnline: false,
        }));
      },
      error: (err) => {
        console.error('Error fetching users', err);
      },
    });
  }

  onSearchChange() {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredFriends = this.users.friends
      .filter((friend: any) => friend.fullName.toLowerCase().includes(query))
      .map((f: any) => ({
        ...f,
        isOnline: f.isOnline || false,
      }));
  }

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

  createConversation(receiverId: string) {
    if (this.isMobileView) {
      this.showChat = true;
    }

    this._chatService.conversation({ receiverId }).subscribe({
      next: (res: any) => {
        this.conversationId = res?.data?.conversation?._id;

        const conversation = res.data.conversation;
        const otherUser =
          conversation.senderId._id === this.currentUserId
            ? conversation.receiverId
            : conversation.senderId;

        this.selectedUser = otherUser;
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

    const msgPayload = {
      roomId: this.conversationId,
      message: this.message,
      sender: this.currentUserId,
    };

    // 🟢 Real-time emit
    this.socketService.sendMessage(msgPayload);

    // 💾 Store in DB
    this._chatService.send(this.conversationId, this.message).subscribe({
      next: () => (this.message = ''),
      error: (err) => console.error('Failed to save message:', err),
    });
  }

  // 🔥 Update each friend's online status
  updateFriendsOnlineStatus(onlineUserIds: string[]) {
    this.filteredFriends = this.filteredFriends.map((friend) => ({
      ...friend,
      isOnline: onlineUserIds.includes(friend._id),
    }));

    if (this.selectedUser) {
      this.selectedUser.isOnline = onlineUserIds.includes(
        this.selectedUser._id
      );
    }
  }
}
