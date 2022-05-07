import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Theme } from '../theme';

@Component({
  selector: 'app-theme-box',
  templateUrl: './theme-box.component.html',
  styleUrls: ['./theme-box.component.css']
})
export class ThemeBoxComponent implements OnInit {

  errorMsg = ""
  theme: Theme = {
    value: "",
    letters: []
  }

  association: string[] = []

  //this is if the user hits submit
  submitThemeButton(): void {
    this.submitThemeEnterKey((<HTMLInputElement>document.getElementById("text")).value.toString())
  }

  setError(err:any): void {
    console.error(err);
    this.errorMsg = "Try another word."

  }
  copyValues(arr: any): void{
    this.association = arr.associations.replace(/,/g, '').split(" ");
    console.log(this.association)
  }

  getAssociatedWords(word: string)
  {
    const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'twinword-word-associations-v1.p.rapidapi.com',
      'X-RapidAPI-Key': '82c7604abfmsh1a50896f4be8971p1886cejsn0203aeca9f75'
    }
  };
  fetch('https://twinword-word-associations-v1.p.rapidapi.com/associations/?entry='+word, options)
    .then(response => response.json())
    .then(response => this.copyValues(response))
    .then( () => this.errorMsg = '')
    .catch(err => this.setError(err)); 
  }

  getPartsOfSpeech(arr:any)
  {
    for (let i = 0; i < arr.length; i++)
    {
      console.log(this.theme.value + ": " + arr[i].partOfSpeech)
    }
  }

  //this is if the user hits enter on the box
  submitThemeEnterKey(val: string)
  {
    this.theme.value = val;
    this.getAssociatedWords(this.theme.value)

    fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+this.theme.value.toString())
    .then(response => response.json())
    .then(response => this.getPartsOfSpeech(response[0].meanings))
  
  }

  constructor() { }

  ngOnInit(): void {
  }

}

