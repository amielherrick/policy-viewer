import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface NavFile {
  name: string;
  file: string;
}

interface NavItem {
  id: string;
  title: string;
  folder: string;
  files: NavFile[];
  expanded?: boolean;
}

interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

interface Navigation {
  sections: NavSection[];
}

@Component({
  selector: 'app-calfresh-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './calfresh-detail.component.html',
  styleUrl: './calfresh-detail.component.css'
})
export class CalfreshDetailComponent implements OnInit {
  navigation: Navigation | null = null;
  selectedContent: SafeHtml | null = null;
  selectedTitle: string = '';
  sidebarCollapsed: boolean = false;
  
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadNavigation();
  }

  loadNavigation() {
    this.http.get<Navigation>('assets/policies/calfresh-navigation.json').subscribe({
      next: (data) => {
        this.navigation = data;
      },
      error: (err) => {
        console.error('Failed to load navigation:', err);
      }
    });
  }

  toggleSection(item: NavItem) {
    item.expanded = !item.expanded;
  }

  loadContent(folder: string, file: string, title: string) {
    const path = `assets/policies/CalFresh/${folder}/${file}`;
    this.selectedTitle = title;
    
    this.http.get(path, { responseType: 'text' }).subscribe({
      next: (html) => {
        this.selectedContent = this.sanitizer.bypassSecurityTrustHtml(html);
      },
      error: (err) => {
        console.error('Failed to load content:', err);
        this.selectedContent = this.sanitizer.bypassSecurityTrustHtml(
          '<p>Failed to load content. Please try again.</p>'
        );
      }
    });
  }
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}