import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StoryService } from '../services/story.service';
import { Story} from '../models/story';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-story-list',
  standalone: true,
  imports:[
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss'],
})
export class StoryListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'url'];
  dataSource = new MatTableDataSource<Story>();
  totalItems: number = 0;
  pageSize = 10;
  currentPage = 1;
  searchQuery = '';
  isLoading = false;

  constructor(private storyService: StoryService) {}

  ngOnInit(): void {
    this.loadStories();
  }

  loadStories(): void {
    this.isLoading = true; 
    if (this.searchQuery.trim()) {
      this.storyService.searchStories(this.searchQuery).subscribe(
        (stories) => {
          this.dataSource.data = stories;
          this.totalItems = stories.length;
          this.isLoading = false; 
        },
        (error) => {
          console.error('Error loading stories:', error);
          this.isLoading = false; 
        }
      );
    } else {
      this.storyService.getStories(this.currentPage, this.pageSize).subscribe(
        (response) => {
          this.dataSource.data = response.items;
          this.totalItems = response.totalCount;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading stories:', error);
          this.isLoading = false;
        }
      );
    }
  }

  onSearch(): void {
    this.loadStories();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadStories();
  }
}
