//https://www.freecodecamp.org/news/async-await-javascript-tutorial/
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
  letters: boolean[] = []
  association: string[] = []

  setError(err:any): void {
    console.error(err);
    this.errorMsg = "Try another word."
  }

  //this is if the user hits submit
  submitThemeButton(): void {
    this.submitThemeEnterKey((<HTMLInputElement>document.getElementById("text")).value.toString())
  }

  //this is if the user hits enter on the box
  submitThemeEnterKey(val: string)
  {

    //set the theme value
    this.theme.value = val;

    //set [a=false; b=false .... z=false]
    for(let i = 0; i < 26; i++)
    {
      this.letters.push(false)
    }

    //for the theme word, set values to true. letters[0] = a
    for(let i = 0; i < val.length; i++)
    {
      this.letters[Number(val.toLowerCase().charCodeAt(i) - 96)-1] = true
    }

    console.log(this.letters)

    this.getAssociatedWords(this.theme.value)

    this.getDiccionaryInformation(this.theme.value)

    console.log(this.association.length + "this is length");
    for(let i = 0; i < this.association.length; i++)
    {
      this.getDiccionaryInformation(this.association[i]);
    }
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

  /*
    this returns an array of length 1 with a string of words separated by comma  
  */
  fetch('https://twinword-word-associations-v1.p.rapidapi.com/associations/?entry='+word, options)
    .then(response => response.json())
    .then(response => {this.copyValues(response)})
    .then( () => this.errorMsg = '')
    .catch(err => this.setError(err)); 
  }

  getDiccionaryInformation(word: string)
  {
    fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+word)
    .then(response => response.json())
    .then(response => { this.getPartsOfSpeech(word, response[0].meanings) })
  }


  copyValues(arr: any): void{
    this.association = arr.associations.replace(/,/g, '').split(" ");
    console.log(this.association)
  }

  getPartsOfSpeech(word: string, arr:any)
  {
    let noun = false
    let verb = false
    let adjective = false
    let adverb = false
   
    for (let i = 0; i < arr.length; i++)
    {
      console.log(word + ": " + arr[i].partOfSpeech)
    }
  }


  constructor() { }

  ngOnInit(): void {
  }

}

/*
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
  letters: boolean[] = []

  association: string[] = []

  setError(err:any): void {
    console.error(err);
    this.errorMsg = "Try another word."

  }

  //this is if the user hits submit
  submitThemeButton(): void {
    this.submitThemeEnterKey((<HTMLInputElement>document.getElementById("text")).value.toString())
  }

  //this is if the user hits enter on the box
  submitThemeEnterKey(val: string)
  {

    //set the theme value
    this.theme.value = val;

    //set [a=false; b=false .... z=false]
    for(let i = 0; i < 26; i++)
    {
      this.letters.push(false)
    }

    //for the theme word, set values to true. letters[0] = a
    for(let i = 0; i < val.length; i++)
    {
      this.letters[Number(val.toLowerCase().charCodeAt(i) - 96)-1] = true
    }

    console.log(this.letters)
    this.getAssociatedWords(this.theme.value)
    this.getDiccionaryInformation(this.theme.value)

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
    .then( () => this.errorMsg = '')
    .then(response => console.log(response))
    .then(response => this.copyValues(response))
    .catch(err => this.setError(err)); 
  }

  getDiccionaryInformation(word: string)
  {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'twinword-word-associations-v1.p.rapidapi.com',
        'X-RapidAPI-Key': '82c7604abfmsh1a50896f4be8971p1886cejsn0203aeca9f75'
      }
    };
    fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+word)
    .then(response => response.json())
    .then(response => this.getPartsOfSpeech(response[0].meanings));
  }

  copyValues(arr: any): void{
    this.association = arr.associations.replace(/,/g, '').split(" ");
    console.log(this.association)
    for (let i = 0; i < this.association.length; i++)
    {
    fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+this.association[i].toString())
    .then(response => response.json())
    .then(response => this.getPartsOfSpeech(response[0].meanings))
    }
  }

  getPartsOfSpeech(arr:any)
  {
    let noun = false
    let verb = false
    let adjective = false
    let adverb = false

    for (let i = 0; i < arr.length; i++)
    {
      console.log( + ": " + arr[i].partOfSpeech)
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
*/