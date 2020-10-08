const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
  static translateButtonClickHanlder(e) {
    let translation;
    if(document.getElementById('text-input').value) {
      document.getElementById('error-msg').innerHTML = "";
      let input = document.getElementById('text-input').value;
      let selection = document.getElementById('locale-select').value
      if(selection === 'american-to-british') {
        translation = Translator.translateAmericanToBritish(
          input,
          true
        )
      } else {
        translation = Translator.translateBritishToAmerican(
          input,
          true
        )
      }
      // Check if there have been no changes
      if(translation !== input) {
        document.getElementById('translated-sentence').innerHTML = translation;
      } else {
        document.getElementById('translated-sentence')
          .innerHTML = "Everything looks good to me!"
      }
    } else {
      document.getElementById('error-msg').innerHTML = "Error: No text to translate.";
    }
  }

  static clearButtonClickHandler(e) {
    document.getElementById('translated-sentence').innerHTML = "";
    document.getElementById('error-msg').innerHTML = "";
  }


  static replaceCurry(word, replacement, highlight, adjustCase = false)  {
    if(adjustCase) {
      replacement = replacement.replace(/^([a-z])/ig, letter => letter.toUpperCase());
    }
    return (word) => {
      if(highlight) {
        return `<span class="highlight">${replacement}</span>`.replace(/\s/g,"\0");
      } else {
        return '~' + replacement.replace(/\s/g,"\0") + '~';
      }
    }
  }

  static translateAmericanToBritish(input, highlight=false) {
    let american, british;

    // Phrases
    for([american, british] of Object.entries(americanOnly) ) {
      input = input.replace(new RegExp(`\\b${american}\\b`,'gi'),
        Translator.replaceCurry(american,british,highlight));
    }

    // Spelling
    for([american, british] of Object.entries(americanToBritishSpelling) ) {
      input = input.replace(new RegExp(`\\b${american}\\b`,'gi'),
        Translator.replaceCurry(american,british,highlight));
    }

    // Title Replacement
    for([american, british] of Object.entries(americanToBritishTitles) ) {
      american = american.replace('.', '\.');
      input = input.replace(new RegExp(`\\b${american}`,'gi'),
        Translator.replaceCurry(american,british,highlight, true));
    }

    // Time Replacement, colon to period replacement
    input = input.replace(/(?<=\d):(?=\d)/gi, '.');

    // Uppercase start of sentence
    input = input.replace(/^([a-z])/ig, letter => letter.toUpperCase());

    return input.replace(/~/g, '').replace(/\0/g, ' ');
  }

  static translateBritishToAmerican(input, highlight=false) {
    let american, british;

    // Phrases
    for([british, american] of Object.entries(britishOnly) ) {
      input = input.replace(new RegExp(`\\b${british}\\b`,'gi'),
        Translator.replaceCurry(british,american,highlight));
    }

    // Spelling
    for([american, british] of Object.entries(americanToBritishSpelling) ) {
      input = input.replace(new RegExp(`\\b${british}\\b`,'gi'),
        Translator.replaceCurry(british,american,highlight));
    }

    // Title Replacement
    for([american, british] of Object.entries(americanToBritishTitles) ) {
      input = input.replace(new RegExp(`\\b${british}\\b`,'gi'),
        Translator.replaceCurry(british,american,highlight, true));
    }

    // Time Replacement, colon to period replacement
    input = input.replace(/(?<=\d)\.(?=\d)/gi, ':');

    // Uppercase start of sentence
    input = input.replace(/^([a-z])/ig, letter => letter.toUpperCase());

    return input.replace(/~/g, '').replace(/\0/g, ' ');
  }
}

module.exports = Translator;