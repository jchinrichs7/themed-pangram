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

  association: string[] = ['hi', 'there']

  //this is if the user hits submit
  submitTheme(): void {
    this.getValues((<HTMLInputElement>document.getElementById("text")).value.toString())
  }

  copyValues(arr:any): void{
    this.association = arr.associations.replace(/,/g, '').split(" ");
    console.log(this.association)
    
  }

  //this is if the user hits enter on the box
  getValues(val: string)
  {
    this.theme.value = val;
    const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'twinword-word-associations-v1.p.rapidapi.com',
      'X-RapidAPI-Key': '82c7604abfmsh1a50896f4be8971p1886cejsn0203aeca9f75'
    }
  };
  fetch('https://twinword-word-associations-v1.p.rapidapi.com/associations/?entry=sound', options)
    .then(response => response.json())
    .then(response => this.copyValues(response))
    .catch(err => console.error(err));
  }



  constructor() { }

  ngOnInit(): void {
  }

}

