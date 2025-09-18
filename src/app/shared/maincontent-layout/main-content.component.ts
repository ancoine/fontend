import { Component, Input } from '@angular/core';

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent {
  @Input() breadcrumbs: BreadcrumbItem[] = [];
  @Input() pageTitle = '';
  @Input() showActions = true;
}