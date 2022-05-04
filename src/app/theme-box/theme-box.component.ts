import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Theme } from '../theme';

@Component({
  selector: 'app-theme-box',
  templateUrl: './theme-box.component.html',
  styleUrls: ['./theme-box.component.css']
})
export class ThemeBoxComponent implements OnInit {

  theme: Theme = {
    value: "",
    letters: []
  }

  //this is if the user hits submit
  submitTheme(): void {
    this.getValues((<HTMLInputElement>document.getElementById("text")).value.toString())
  }

  //this is if the user hits enter on the box
  getValues(val: string)
  {
    this.theme.value = val;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
