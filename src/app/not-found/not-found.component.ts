import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  options: any = {
    path: 'https://assets10.lottiefiles.com/packages/lf20_HpFqiS.json', // example 404 animation URL
    renderer: 'svg',
    loop: true,
    autoplay: true,
  };
}
