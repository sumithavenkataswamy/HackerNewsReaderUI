import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoryListComponent } from "./story-list/story-list.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StoryListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
