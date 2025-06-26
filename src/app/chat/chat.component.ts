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
  isMobileView = false;
  showChat = false;
  selectedUser: any = null;
  lottieOptions = {
    path: 'https://assets2.lottiefiles.com/packages/lf20_tll0j4bb.json',
  };
  lottieSecondOptions = {
    path: '../../assets/Animation - 1749436448592.json',
    autoplay: true,
    loop: true,
  };

  onlineUserIds = new Set<string>();
  currentUserId: any;
  users: any;
  filteredFriends: any[] = [];
  chats: any[] = [];
  message: any;
  conversationId: any;
  messages: any[] = [];
  username: any;
  isChatOpenOnMobile = false;
  searchQuery = '';

  private socketSub!: Subscription;

  constructor(
    private _userService: UserService,
    private _chatService: ChatService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.getUserIdFromToken();
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
    this.joinMyRooms();

    this.socketSub = this.socketService.onMessage().subscribe((msg: any) => {
      if (msg.conversationId === this.conversationId) {
        this.messages = [...this.messages, msg];
      }
    });
  }

  ngOnDestroy() {
    if (this.socketSub) this.socketSub.unsubscribe();
    if (this.conversationId) this.socketService.leaveRoom(this.conversationId);
  }

  getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = (jwtDecode as any).default
          ? (jwtDecode as any).default(token)
          : (jwtDecode as any)(token);
        this.currentUserId = decodedToken.id;

        this.socketService.sendUserId(this.currentUserId); // ✅ Notify backend
        this.getAllUser(); // ✅ Fetch friends
        this.socketService.getOnlineUsers().subscribe((userIds: string[]) => {
          this.onlineUserIds = new Set(userIds); // ✅ Store live list
        });
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
      error: (err) => console.error('Error fetching users', err),
    });
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
        error: (err) => console.error('❌ Failed to join rooms', err),
      });
    }
  }

  createConversation(receiverId: string) {
    if (this.isMobileView) this.showChat = true;

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
      error: (err) => console.error('Failed to create conversation', err),
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
      error: (err) => console.error('Failed to send message:', err),
    });
  }

  checkScreenSize() {
    this.isMobileView = window.innerWidth <= 768;
    if (!this.isMobileView) this.showChat = false;
  }

  openChatOnMobile(userName: string) {
    this.isChatOpenOnMobile = true;
    this.selectedUser = userName;
  }

  closeChatOnMobile() {
    this.isChatOpenOnMobile = false;
    this.selectedUser = '';
  }

  onSearchChange() {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredFriends = this.users.friends.filter((friend: any) =>
      friend.fullName.toLowerCase().includes(query)
    );
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUserIds.has(userId);
  }
}
