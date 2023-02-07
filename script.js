"use strict";

// ONE-PAGED WEBSITE
var app = (function(){
    let pages = [];
    let links = [];

    document.addEventListener("DOMContentLoaded", function(){
        pages = document.querySelectorAll('[data-page]');
        links = document.querySelectorAll('[data-role="link"]');
        [].forEach.call(links, function(link){
            link.addEventListener("click", navigate)
        });
    });
    
    function navigate(ev){
        ev.preventDefault();
        let id = ev.currentTarget.href.split("#")[1];
        [].forEach.call(pages, function(page){
           if(page.id ===id){
               page.classList.add('active');
           }else{
               page.classList.remove('active');
           } 
        });
        return false;
    }
    
    return {
        pages,
        links
    }
})();

// API CODE
const searchedWord = document.querySelector('.search-bar');
const search_button = document.querySelector('.submit-btn');
const def = document.querySelector('.definitions');
const searchWord = document.querySelector('.searched-word');
const numOfDefs = document.querySelector('.no-of-defs');
const transcript = document.querySelector('.transcription');
const partOfSpeech = document.querySelector('.p-o-s');
const synn = document.querySelector('.syns');
const defSection = document.querySelector('.df-sec');
const mic = document.querySelector(".img-mic");
const defHead = document.querySelector(".ddf");
const synss = document.querySelector(".ssn");
const homeBtn = document.querySelector(".go-home");
const errMess = document.querySelector(".error-msg");
const inputErr = document.querySelector(".inputError");
const wantMore = document.querySelector(".want-more");
const moreDefinitions = document.querySelector(".more-defs");
const clickMore = document.querySelector(".click-btn");

search_button.addEventListener("click", async() =>{
    try{
        let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchedWord.value.toLowerCase()}`;
        const response = await fetch(url);
        const data = await response.json();
        document.querySelector(".spinner-container").style.display = "none";
        displayData(data);
    }
    catch(error){
        console.error("An error has occured.");
        defSection.style.backgroundColor = "red";
        defHead.style.display = "none";
        synss.style.display = "none";
        mic.style.display = "none";
        def.style.display = "none";
        numOfDefs.style.display = "none";
        transcript.style.display = "none";
        partOfSpeech.style.display = "none";
        wantMore.style.display = "none";
        errMess.style.display = "block";
        errMess.style.marginTop = "-80px";
    }
})

const displayData = (data) => {
    console.log(data);
    defSection.style.display = "block";

    // AUDIO
    mic.addEventListener("click", function(){
        // alert("Mic clicked");
        const wordPronunciation = data[0].phonetics[0].audio;
        const wordPronunciation2 = data[0].phonetics[1].audio;
        const wp = new Audio(wordPronunciation);
        const wp2 = new Audio(wordPronunciation2);
        // if (wp){
            wp.play();
        // }else{
            wp2.play();
        // }
        console.log(`Word pronunciation: ${wordPronunciation}`);
        console.log(`Word pronunciation: ${wordPronunciation2}`);
    });

    // DEETS ABOUT THE WORD
    const deets = data.length;
    console.log(`This word has ${deets} deets.`)

    // DISPLAYS THE MAIN WORD
    const mainWord = data[0].word;
    console.log(`The word is: ${mainWord}`);
    searchWord.innerHTML = mainWord;

    // DISPLAYING THE NUMBER OF DEFINITIONS/OCCURRENCES
    const noOfDefs = Object.keys(data[0].meanings[0].definitions).length;
    console.log(`The number of definitons: ${noOfDefs}`);
    if (noOfDefs == 1){
        numOfDefs.innerHTML = noOfDefs;
        console.log('There is 1 def')
    }
    else{
        numOfDefs.innerHTML = noOfDefs;
        wantMore.style.display = "block";
    }

    // DISPLAYING THE DEFINITIONS
    function deff(arr, prop) {
        let partSpeech = arr.map(item => item[prop]);
        return partSpeech;
    }
    const defMain = Object.values(data[0].meanings[0].definitions);
    const result2 = deff(defMain, 'definition');

    // MORE DEFINITIONS
    console.log(`The definitions: ${result2}`);
    const ress = result2.join(" <br> ")
    moreDefinitions.innerHTML = ress;

    // TO DISPLAY THE FIRST DEFINITION
    const outputDefinition = data[0].meanings[0].definitions[0].definition;
    def.innerHTML = outputDefinition;
 
    // PHONETICS
    const transcribe = data[0].phonetic;
    console.log(`The transcription: ${transcribe}`);
    transcript.innerHTML = transcribe;

    // PART OF SPEECH
    function pos(arr, prop) {
        let partSpeech = arr.map(item => item[prop]);
        return partSpeech;
    }
    const partDer = Object.values(data[0].meanings);
    const result = pos(partDer, 'partOfSpeech');
    console.log(`The part of speech: ${result}`);
    partOfSpeech.innerHTML = result.join(", ");

    // SYNONYMS 
    function synFunction(arr, prop){
        let synMap = arr.map(item => item[prop]);
        return synMap;
    }
    const syn = Object.values(data[0].meanings);
    const synResult = synFunction(syn, 'synonyms');
    console.log(synResult.length)
    console.log(`The synonyms include: ${synResult}`);
    synn.innerHTML = synResult.join(",");
}
