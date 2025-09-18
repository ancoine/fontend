import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header-layout/header-layout.component';
import { SidebarComponent } from "./shared/sidebar-layout/sidebar-layout.component";

import { TableData } from "./shared/maincontent-layout/table-component";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, TableData],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('quanlyts');
}
