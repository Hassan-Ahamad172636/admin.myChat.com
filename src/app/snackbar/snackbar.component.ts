import { Component } from '@angular/core';
import { SnackService } from '../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent {
  snack: any;

  classMap: any = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600 text-gray-900',
    info: 'bg-blue-600',
  };

  constructor(private snackService: SnackService) {
    this.snackService.snack$.subscribe((snack) => {
      this.snack = snack;
      
    });
  }
}
