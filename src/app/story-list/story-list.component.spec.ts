import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { StoryListComponent } from './story-list.component';
import { StoryService } from '../services/story.service';
import { of } from 'rxjs';
import { Story } from '../models/story';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('StoryListComponent', () => {
  let component: StoryListComponent;
  let fixture: ComponentFixture<StoryListComponent>;
  let storyService: jasmine.SpyObj<StoryService>;

  const mockStories: Story[] = [
    { title: 'Story 1', url: 'https://story1.com' },
    { title: 'Story 2', url: 'https://story2.com' },
  ];

  beforeEach(async () => {
    const storyServiceSpy = jasmine.createSpyObj('StoryService', ['getStories']);

    await TestBed.configureTestingModule({
      imports: [
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FormsModule,
        StoryListComponent,
      ],
      providers: [
        provideHttpClientTesting(),
        { provide: StoryService, useValue: storyServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;
    storyService = TestBed.inject(StoryService) as jasmine.SpyObj<StoryService>;

    storyService.getStories.and.returnValue(
      of({ items: mockStories, totalCount: mockStories.length })
    );
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and call loadStories on component initialization', () => {
    spyOn(component, 'loadStories');
    component.ngOnInit();
    expect(component.loadStories).toHaveBeenCalled();
  });

  it('should load stories correctly', () => {
    component.loadStories();
    expect(storyService.getStories).toHaveBeenCalledWith(component.currentPage, component.pageSize, undefined);
    expect(component.dataSource.data).toEqual(mockStories);
    expect(component.totalItems).toEqual(mockStories.length);
  });

  it('should handle search correctly', () => {
    component.searchQuery = 'Story';
    component.onSearch();
    expect(component.currentPage).toEqual(0);
    expect(storyService.getStories).toHaveBeenCalledWith(component.currentPage, component.pageSize, 'Story');
    expect(component.dataSource.data).toEqual(mockStories);
  });

  it('should handle pagination correctly', () => {
    const pageEvent: PageEvent = { pageIndex: 1, pageSize: 5, length: 10 };
    component.onPageChange(pageEvent);
    expect(component.currentPage).toEqual(2);
    expect(component.pageSize).toEqual(5);
    expect(storyService.getStories).toHaveBeenCalledWith(component.currentPage, component.pageSize, undefined);
  });

  it('should reset search query and reload stories on empty search', () => {
    component.searchQuery = '';
    component.onSearch();
    expect(component.currentPage).toEqual(0);
    expect(storyService.getStories).toHaveBeenCalledWith(component.currentPage, component.pageSize, undefined);
  });

  it('should hide spinner after data is loaded', () => {
    component.isLoading = false;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-spinner')).toBeNull();
  });  
});
