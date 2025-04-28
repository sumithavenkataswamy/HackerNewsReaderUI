import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StoryService } from '../services/story.service';
import { Story } from '../models/story';
import { PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-story-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss'],
})
export class StoryListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'url'];
  dataSource = new MatTableDataSource<Story>();
  totalItems: number = 0;
  pageSize = 10;
  currentPage = 0;
  searchQuery = '';
  isLoading = false;

  constructor(private storyService: StoryService) {}

  ngOnInit(): void {
    this.loadStories();
  }

  loadStories(): void {
    this.isLoading = true;

    this.storyService
      .getStories(this.currentPage, this.pageSize, this.searchQuery.trim() ? this.searchQuery : undefined)
      .pipe(
        tap((response) => {
          this.dataSource.data = response.items.filter((story) => story.url);
          this.totalItems = response.totalCount;
        }),
        catchError((error) => {
          console.error('Error loading stories:', error);
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(); 
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadStories();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadStories();
  }
}
