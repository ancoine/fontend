import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'sidebar-layout',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.scss']
})
export class SidebarComponent {
  isOpen$!: Observable<boolean>;
  isOpen = true;
  openGroup: Record<string, boolean> = { catalog: false };

  constructor(private sidebar: SidebarService) {
    this.isOpen$ = this.sidebar.open$;
    this.sidebar.open$.subscribe(v => this.isOpen = v);
  }

  toggleGroup(key: string): void {
    this.openGroup[key] = !this.openGroup[key];
  }

  isGroupOpen(key: string): boolean {
    return !!this.openGroup[key];
  }
}