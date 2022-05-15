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
  theme: Theme = 
  {
    value: "",
    letters: []
  }
  letters: boolean[] = []
  association: string[] = []
  relatedWords: string[][] = []

  setError(err:any): void 
  {
    console.error(err);
    this.errorMsg = "Try another word."
  }

  //this is if the user hits submit
  submitThemeButton(): void 
  {
    this.submitThemeEnterKey((<HTMLInputElement>document.getElementById("text")).value.toString())
  }

  //this is if the user hits enter on the box
  async submitThemeEnterKey(val: string)
  {
    //set the theme value
    this.theme.value = val;
    /* should just get the part of speech for this separately */

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

    //get associated words
    let associatedWords: string = await this.getAssociatedWords(this.theme.value)
    console.log(associatedWords)

    //partsofspeech = ["associatedword, partOfSpeech1, partOfSpeech2 ... N", "assoc2" ..]
    let relatedInfo: string[] = [];
    for (let i = 0; i < associatedWords.length; i++)
    {
      let responseArr = await this.getPartsOfSpeech(associatedWords[i])
      relatedInfo[i] =  associatedWords[i] + ","
      for (let j = 0; j < responseArr.length; j++)
      {
        relatedInfo[i] += responseArr[j]
        if(j+1 < responseArr.length) relatedInfo[i] += ","
      }
    }

    for (let i = 0; i < relatedInfo.length; i++)
    {
      console.log(relatedInfo[i])
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
      .then(response => { return response.associations.replace(/,/g, '').split(" ");})
      .catch(err => this.setError(err)); 

      return res
  }

  async getPartsOfSpeech(word: string): Promise<string[]>
  {
    let res = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+word)
    .then(response => response.json())
    .then(response => { 

      let ans: string[] = []

      for (let i = 0; i < response[0].meanings.length; i++)
      {
        ans.push(response[0].meanings[i].partOfSpeech)
      }
      return ans
    })
    return res
  }

  constructor() { }

  ngOnInit(): void {
  }

}