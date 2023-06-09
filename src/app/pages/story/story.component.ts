import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css'],
})
export class StoryComponent implements OnInit {
  ngOnInit(): void {}

  displayModal: boolean;

  @Input()
  storiesData: any;

  isImageReference() {
    return this.storiesData[0].referenceType === 'jpg';
  }

  getTime() {
    moment.locale('es');
    return moment(this.storiesData[0].created_at).fromNow();
  }

  showModalDialog() {
    this.displayModal = true;
  }

  validateDate() {
    return moment().isBetween(
      this.storiesData[0].created_at,
      this.storiesData[0].expires_at
    );
  }
}
