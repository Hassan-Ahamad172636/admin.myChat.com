import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SnackService {
  private snackState = new BehaviorSubject<any>(null);
  snack$ = this.snackState.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    this.snackState.next({ message, type });
    setTimeout(() => this.snackState.next(null), 3000);
  }
}
