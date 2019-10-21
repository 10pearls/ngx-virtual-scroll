import { Component } from '@angular/core';
import { data } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  data = data;
  viewportItems: Array<any>;


  onViewportItemChange(items: Array<any>) {
    this.viewportItems = items;
  }

  onScrollEnd() {

  }


  trackByItemId(index: number, item: any) {
    return item._id;
  }
}
