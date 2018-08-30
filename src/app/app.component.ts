import { Component } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  TestForm: FormGroup;

  source1: any[] = [
      { Id: 1, Name: 'One' },
      { Id: 2, Name: 'Two' },
      { Id: 3, Name: 'Three' },
      { Id: 4, Name: 'Four' },
      { Id: 5, Name: 'Five' },
      { Id: 6, Name: 'Six' },
      { Id: 7, Name: 'Seven' },
      { Id: 8, Name: 'Eight' },
      { Id: 9, Name: 'Nine' },
      { Id: 10, Name: 'Ten' }
  ];

  constructor (private fb: FormBuilder) {
    this.TestForm = this.fb.group({
      IdAutoComplete1: new FormControl(null, []),
      IdAutoComplete2: new FormControl(null, [])
    });
  }
}
