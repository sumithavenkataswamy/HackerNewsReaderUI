import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Story } from '../models/story';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  private apiBase = 'https://localhost:7065/api/stories';

  constructor(private http: HttpClient) {}

  getStories(page: number, pageSize: number, query?: string): Observable<{ items: Story[]; totalCount: number }> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (query) {
      params = params.set('query', query);
    }

    return this.http
      .get<{ items: Story[]; totalCount: number }>(this.apiBase, { params })
      .pipe(
        map((response) => {
          const filteredItems = response.items.filter(
            (story) => story.title && story.title.trim() !== '' && story.url && story.url.trim() !== ''
          );
          return { items: filteredItems, totalCount: response.totalCount };
        }),
        catchError((error) => {
          console.error('Error fetching stories:', error);
          return throwError(() => new Error('Error fetching stories: ' + error.message));
        })
      );
  }
}
