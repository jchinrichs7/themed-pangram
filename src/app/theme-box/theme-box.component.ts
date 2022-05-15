//https://www.freecodecamp.org/news/async-await-javascript-tutorial/
//cmd option 2
//918 pm
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Theme } from '../theme';
import { Injectable } from '@angular/core';


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
  relatedWords: string[][] = []

  setError(err:any): void {
    console.error(err);
    this.errorMsg = "Try another word."
  }

  //this is if the user hits submit
  submitThemeButton(): void {
    this.submitThemeEnterKey((<HTMLInputElement>document.getElementById("text")).value.toString())
  }

  //this is if the user hits enter on the box
  async submitThemeEnterKey(val: string)
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

    let associatedWords = await this.getAssociatedWords(this.theme.value)
    console.log(associatedWords)

    let partsOfSpeech: string[] = [];

    for (let i = 0; i < associatedWords.length; i++)
    {
      let responseArr = await this.getDiccionaryInformation(associatedWords[i])
      partsOfSpeech[i] =  associatedWords[i] + ","
      for (let j = 0; j < responseArr.length; j++)
      {
        partsOfSpeech[i] += responseArr[j]
        if(j+1 < responseArr.length) partsOfSpeech[i] += ","
      }
    }

    for (let i = 0; i < partsOfSpeech.length; i++)
    {
      console.log(partsOfSpeech[i])
    }

  } 

  async getAssociatedWords(word: string): Promise<string>
  {
    const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'twinword-word-associations-v1.p.rapidapi.com',
      'X-RapidAPI-Key': '82c7604abfmsh1a50896f4be8971p1886cejsn0203aeca9f75'
     }
    };
    let res = await fetch('https://twinword-word-associations-v1.p.rapidapi.com/associations/?entry='+word, options)
      .then(response => response.json())
      .then(response => {return this.copyValues(response)})
      .catch(err => this.setError(err)); 

      return res;
  }

  async getDiccionaryInformation(word: string): Promise<string[]>
  {
    let res = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+word)
    .then(response => response.json())
    .then(response => { return this.getPartsOfSpeech(word, response[0].meanings) })
    return res
  }


  copyValues(arr: any) {
    return arr.associations.replace(/,/g, '').split(" ");
  }

  async getPartsOfSpeech(word: string, arr:any)
  {

    let noun = false
    let verb = false
    let adjective = false
    let adverb = false
    let ans: string[] = []

    for (let i = 0; i < arr.length; i++)
    {
      ans.push(arr[i].partOfSpeech)
    }
    return ans
  }


  constructor() { }

  ngOnInit(): void {
  }

}