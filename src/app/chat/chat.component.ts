import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { ChatService } from '../services/chat.service';
// import { SocketService } from '../services/socket.service';
import { jwtDecode } from 'jwt-decode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  lottieOptions: any = {
    path: '../../assets/Animation - 1749431376588.json',
    autoplay: true,
    loop: true,
  };

  lottieSecondOptions: any = {
    path: '../../assets/Animation - 1749436448592.json',
    autoplay: true,
    loop: true,
  };

  currentUserId: any;
  users: any[] = [];
  chats: any[] = [];
  message: any;
  conversationId: any;
  messages: any = [];
  username: any;
  isChatOpenOnMobile = false;
  selectedUser: string = '';

  openChatOnMobile(userName: string) {
    this.isChatOpenOnMobile = true;
    this.selectedUser = userName;
  }

  closeChatOnMobile() {
    this.isChatOpenOnMobile = false;
    this.selectedUser = '';
  }

  // private socketSub!: Subscription;

  constructor(
    private _userService: UserService,
    private _chatService: ChatService,
    // private socketService: SocketService
  ) {}

  ngOnInit() {
    this.getUserIdFromToken();
    this.getAllUser();

    // this.socketSub = this.socketService.onMessage().subscribe((msg: any) => {
    //   if (msg.conversationId === this.conversationId) {
    //     this.messages = [...this.messages, msg];
    //   }
    // });
  }

  ngOnDestroy() {
    // if (this.socketSub) this.socketSub.unsubscribe();
    // if (this.conversationId) {
    //   this.socketService.leaveRoom(this.conversationId);
    // }
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
    this._userService.getAllUser().subscribe({
      next: (resp: any) => {
        this.users = resp.data.users || [];
      },
      error: (err) => {
        console.error('Error fetching users', err);
      },
    });
  }

  createConversation(receiverId: string) {
    this._chatService.conversation({ receiverId: receiverId }).subscribe({
      next: (res: any) => {
        this.conversationId = res?.data?.conversation?._id;
        this.username = res?.data?.conversation.receiverId.fullName;
        this.getMessages();

        // this.socketService.joinRoom(this.conversationId);
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
      next: (resp: any) => {
        this.message = '';
        this.getMessages(); // fetch updated messages list after send
        // this.socketService.sendMessage(msgData);
      },
      error: (err) => {
        console.error('Failed to send message:', err);
      },
    });
  }
}
