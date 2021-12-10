import "../styles/style.css";
import { apiLinks } from "./api-links";
import { DOMSelectors } from "./dom-selectors";

/* const URL = `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.addToPlayer}8H,AS`; */ // example of how apiLinks works, this adds 8H and AS (which have already been drawn) to player's hand

/* const URL = `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.draw}5`; */ // draws 5 cards from preexisting deck

async function showCards(url) {
  try {
    const response = await fetch(url);
    const data = await response.json(); // turns response in json we can use
    console.log(data);
    data.cards.forEach((card) => {
      console.log(card.image);
      DOMSelectors.main.insertAdjacentHTML(
        "beforeend",
        `<img src="${card.image}" alt="${card.value} of ${card.suit}">`
      );
    });
  } catch (err) {
    console.log(err);
  }
}

showCards(`${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.draw}2`);

// function greet(name) {
//   const greetPromise = new Promise(function (resolve, reject) {
//     resolve(`hello ${name}`);
//   });
//   return greetPromise;
// }

// const suzie = greet("Suzie");

// suzie.then((result) => {
//   console.log(result);
// });
