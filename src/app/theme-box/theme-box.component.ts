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
  relatedInfo: string[] = []
  candidateNextWords: string[] = []
  sentence: string = ""

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

    //partsofspeech = ["associatedword, partOfSpeech1, partOfSpeech2 ... N", "assoc2" ..]
    //let this.relatedInfo: string[] = [];
    for (let i = 0; i < associatedWords.length; i++)
    {
      let responseArr = await this.getPartsOfSpeech(associatedWords[i])
      this.relatedInfo[i] =  associatedWords[i] + ","
      for (let j = 0; j < responseArr.length; j++)
      {
        this.relatedInfo[i] += responseArr[j]
        if(j+1 < responseArr.length) this.relatedInfo[i] += ","
      }
    }
    console.log(this.relatedInfo)
    
    

  
    //start putting the sentence together
    this.sentence = this.theme.value + " "
    let themePartsOfSpeech = await this.getPartsOfSpeech(this.theme.value)

    if(themePartsOfSpeech.includes('adjective')) 
    {
      this.sentence = this.sentence + " " + this.getBestWordOfType('noun')
    }
    else if (themePartsOfSpeech.includes('noun'))
    {
      this.sentence = this.getBestWordOfType('adjective') + " " + this.sentence
      this.sentence += this.getBestWordOfType('verb')

    }

    console.log(this.sentence.toLowerCase())
  } 

  getBestWordOfType(type: string)
  {
     let bestCandidate = ""
    for(let i = 0; i < this.relatedInfo.length; i++)
    {
        if(this.relatedInfo[i].indexOf(type) != -1) // this word is of the type we want
        {
          console.log(type)
          this.candidateNextWords.push(this.relatedInfo[i].split(",")[0])
        }
    }

    if(this.candidateNextWords.length == 0) return 
    console.log(this.candidateNextWords)
   
    let maxNewLetters = -1

    for(let i = 0; i < this.candidateNextWords.length; i++)
    {
      let thisNewLetters = this.newLetterIndicies(this.sentence, this.candidateNextWords[i])
      if (thisNewLetters.length > maxNewLetters)
      {
        bestCandidate = this.candidateNextWords[i]
        maxNewLetters = thisNewLetters.length
      }
    }

    console.log(bestCandidate + ", " + maxNewLetters + " new letters !")
    return(bestCandidate)
  }

  newLetterIndicies(sentence: string, word: string): number[]
  {
    let indicies: number[] = []
    for(let i = 0; i < word.length; i++)
    {
      let found: boolean = false
      for(let j = 0; j < this.sentence.length; j++)
      {
        if(word.charAt(i) == this.sentence.charAt(j))
        {
          found = true
          break
        }
      }

      if (!found)
      {
        //make sure its not already in the array
        if(indicies.indexOf(Number(word.toLowerCase().charCodeAt(i) - 96)-1) == -1)
        {
          indicies.push(Number(word.toLowerCase().charCodeAt(i) - 96)-1)
        }
      }
    }
    return indicies
  }

  async getAssociatedWords(word: string): Promise<string>
  {
    const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'twinword-word-associations-v1.p.rapidapi.com',
      'X-RapidAPI-Key': '82c7604abfmsh1a50896f' + (2+2).toString() + 'be8971p1886cejsn0203aeca9f75'
     }
    };
    let res = await fetch('https://twinword-word-associations-v1.p.rapidapi.com/associations/?entry='+word, options)
      .then(response => response.json())
      .then(response => {return response.associations.replace(/,/g, '').split(" ");})
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