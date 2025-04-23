import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Story } from '../models/story';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  private apiBase = 'https://localhost:7065/api/stories'; // Replace with your API base URL

  constructor(private http: HttpClient) {}

  getStories(page: number, pageSize: number): Observable<{ items: Story[]; totalCount: number }> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<{ items: Story[]; totalCount: number }>(this.apiBase, { params });
  }

  searchStories(query: string): Observable<Story[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Story[]>(`${this.apiBase}/search`, { params });
  }
}
