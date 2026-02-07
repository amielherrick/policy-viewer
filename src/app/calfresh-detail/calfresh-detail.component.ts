import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import Fuse from 'fuse.js';

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

interface SearchResult {
  file: NavFile;
  folder: string;
  sectionTitle: string;
  score: number;
}

@Component({
  selector: 'app-calfresh-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './calfresh-detail.component.html',
  styleUrl: './calfresh-detail.component.css'
})
export class CalfreshDetailComponent implements OnInit {
  navigation: Navigation | null = null;
  selectedContent: SafeHtml | null = null;
  selectedTitle: string = '';
  sidebarCollapsed: boolean = false;
  
  searchQuery: string = '';
  searchResults: SearchResult[] = [];
  isSearching: boolean = false;
  fuse: Fuse<any> | null = null;
  
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
        this.initializeSearch();
      },
      error: (err) => {
        console.error('Failed to load navigation:', err);
      }
    });
  }

  initializeSearch() {
    if (!this.navigation) return;

    // Build searchable index
    const searchableItems: any[] = [];
    
    this.navigation.sections.forEach(section => {
      section.items.forEach(item => {
        item.files.forEach(file => {
          searchableItems.push({
            name: file.name,
            file: file.file,
            folder: item.folder,
            sectionTitle: item.title
          });
        });
      });
    });

    // Initialize Fuse.js
    this.fuse = new Fuse(searchableItems, {
      keys: ['name', 'sectionTitle'],
      threshold: 0.3,
      includeScore: true
    });
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      this.isSearching = false;
      return;
    }

    this.isSearching = true;

    if (this.fuse) {
      const results = this.fuse.search(this.searchQuery);
      this.searchResults = results.slice(0, 10).map(result => ({
        file: { name: result.item.name, file: result.item.file },
        folder: result.item.folder,
        sectionTitle: result.item.sectionTitle,
        score: result.score || 0
      }));
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.isSearching = false;
  }

  loadSearchResult(result: SearchResult) {
    this.loadContent(result.folder, result.file.file, result.file.name);
    this.clearSearch();
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