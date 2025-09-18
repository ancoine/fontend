import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
@Component({
  selector: 'header-layout',
  templateUrl: './header-layout.component.html',
  styleUrls: ['./header-layout.component.scss']
})
export class HeaderComponent {

   constructor(public sidebar: SidebarService) {}
  
}
