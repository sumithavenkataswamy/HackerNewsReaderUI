import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StoryService } from './story.service';
import { Story } from '../models/story';
import { catchError, of, tap } from 'rxjs';

describe('StoryService', () => {
  let service: StoryService;
  let httpMock: HttpTestingController;

  const mockStories: Story[] = [
    { title: 'Story 1', url: 'https://story1.com' },
    { title: 'Story 2', url: 'https://story2.com' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StoryService],
    });

    service = TestBed.inject(StoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch stories with pagination', () => {
    const page = 1;
    const pageSize = 10;

    service.getStories(page, pageSize).subscribe((response) => {
      const filteredStories = mockStories.filter(
        (story) => story.title && story.title.trim() !== '' && story.url && story.url.trim() !== ''
      );
      expect(response.items).toEqual(filteredStories);
      expect(response.totalCount).toEqual(mockStories.length);
    });

    const req = httpMock.expectOne(
      `https://localhost:7065/api/stories?page=${page}&pageSize=${pageSize}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ items: mockStories, totalCount: mockStories.length });
  });

  it('should filter out invalid stories with null or empty properties', (done) => {
    const mockIncompleteStories: Story[] = [
      { title: 'Story 1', url: 'https://story1.com' },
      { title: '', url: 'https://story2.com' },
      { title: null, url: '' },
    ];
  
    service.getStories(1, 10).pipe(
      tap((response) => {
        const filteredStories = mockIncompleteStories.filter(
          (story) => story.title && story.title.trim() !== '' && story.url && story.url.trim() !== ''
        );
        expect(response.items).toEqual([{ title: 'Story 1', url: 'https://story1.com' }]);
        expect(response.totalCount).toEqual(3);
        done();
      }),
      catchError(() => {
        fail('This should not fail');
        done();
        return of(null);
      })
    ).subscribe();
  
    const req = httpMock.expectOne(`https://localhost:7065/api/stories?page=1&pageSize=10`);
    req.flush({ items: mockIncompleteStories, totalCount: mockIncompleteStories.length });
  });
  
  

  it('should handle API errors gracefully', (done) => {
    service.getStories(1, 10).pipe(
      tap(() => fail('Expected an error but got success')),
      catchError((error) => {
        expect(error.message).toContain('Http failure response for https://localhost:7065/api/stories?page=1&pageSize=10');
        done();
        return of(null);
      })
    ).subscribe();
  
    const req = httpMock.expectOne(`https://localhost:7065/api/stories?page=1&pageSize=10`);
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  });
  
});
