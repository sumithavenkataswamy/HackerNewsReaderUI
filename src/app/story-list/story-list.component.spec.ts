import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { StoryListComponent } from './story-list.component';
import { StoryService } from '../services/story.service';
import { of } from 'rxjs';
import { Story } from '../models/story';

describe('StoryListComponent', () => {
  let component: StoryListComponent;
  let fixture: ComponentFixture<StoryListComponent>;
  let storyService: jasmine.SpyObj<StoryService>;

  const mockStories: Story[] = [
    { title: 'Story 1', url: 'https://story1.com' },
    { title: 'Story 2', url: 'https://story2.com' },
  ];

  beforeEach(async () => {
    const storyServiceSpy = jasmine.createSpyObj('StoryService', ['getStories', 'searchStories']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule, // Import spinner module for testing
        FormsModule,
        StoryListComponent,
      ],
      providers: [{ provide: StoryService, useValue: storyServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;
    storyService = TestBed.inject(StoryService) as jasmine.SpyObj<StoryService>;

    // Mocking service methods to return observables
    storyService.getStories.and.returnValue(
      of({ items: mockStories, totalCount: mockStories.length })
    );
    storyService.searchStories.and.returnValue(of(mockStories));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and call loadStories', () => {
    spyOn(component, 'loadStories');
    component.ngOnInit();
    expect(component.loadStories).toHaveBeenCalled();
  });

  it('should load stories correctly', () => {
    component.loadStories();

    expect(storyService.getStories).toHaveBeenCalledWith(component.currentPage, component.pageSize);
    expect(component.dataSource.data).toEqual(mockStories);
    expect(component.totalItems).toEqual(mockStories.length);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle search query correctly', () => {
    component.searchQuery = 'Story';
    component.onSearch();

    expect(storyService.searchStories).toHaveBeenCalledWith('Story');
    expect(component.dataSource.data).toEqual(mockStories);
    expect(component.totalItems).toEqual(mockStories.length);
  });

  it('should handle pagination correctly', () => {
    const pageEvent = { pageIndex: 1, pageSize: 5 } as any;
    component.onPageChange(pageEvent);

    expect(component.currentPage).toEqual(2);
    expect(component.pageSize).toEqual(5);
    expect(storyService.getStories).toHaveBeenCalledWith(component.currentPage, component.pageSize);
  });

  it('should handle empty search query correctly', () => {
    component.searchQuery = '';
    component.onSearch();

    expect(storyService.getStories).toHaveBeenCalledWith(component.currentPage, component.pageSize);
    expect(component.dataSource.data).toEqual(mockStories);
    expect(component.totalItems).toEqual(mockStories.length);
  });


  it('should hide spinner after data load', () => {
    component.isLoading = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-spinner')).toBeNull();
  });
});
