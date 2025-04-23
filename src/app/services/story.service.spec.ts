import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StoryService } from './story.service';
import { Story } from '../models/story';

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
    httpMock.verify(); // Verify no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch stories with pagination', () => {
    const page = 1;
    const pageSize = 10;

    service.getStories(page, pageSize).subscribe((response) => {
      expect(response.items).toEqual(mockStories);
      expect(response.totalCount).toEqual(mockStories.length);
    });

    const req = httpMock.expectOne(
      `https://localhost:7065/api/stories?page=${page}&pageSize=${pageSize}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ items: mockStories, totalCount: mockStories.length }); // Mock response
  });

  it('should search stories based on query', () => {
    const query = 'Story';

    service.searchStories(query).subscribe((response) => {
      expect(response).toEqual(mockStories);
    });

    const req = httpMock.expectOne(
      `https://localhost:7065/api/stories/search?query=${query}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockStories); // Mock response
  });
});
