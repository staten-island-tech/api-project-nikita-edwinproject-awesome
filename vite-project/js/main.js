import "../styles/style.css";
import { apiLinks } from "./api-links";
import { DOMSelectors } from "./dom-selectors";

/* const URL = `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.addToPlayer}8H,AS`; */ // example of how apiLinks works, this adds 8H and AS (which have already been drawn) to player's hand

/* const URL = `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.draw}5`; */ // draws 5 cards from preexisting deck

async function fetchApi(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function draw(number) {
  try {
    const response = await fetch(
      `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.draw}${number}`
    );
    const data = await response.json(); // turns response in json we can use
    console.log(data);
    data.cards.forEach((card) => {
      console.log(card.image);
      DOMSelectors.main.insertAdjacentHTML(
        "beforeend",
        `<img src="${card.image}" alt="${card.value} of ${card.suit}" class="card">`
      );
      await fetch(
        `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.drawnCards}`
      );
    });
  } catch (err) {
    console.log(err);
  }
}

draw(2);

function shuffle() {
  if (DOMSelectors.main.children.length > 0) {
    while (DOMSelectors.main.children.length > 0) {
      document.querySelector(".card").remove();
    }
  }
  fetchApi(`${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.shuffle}`);
}

DOMSelectors.shuffleBtn.addEventListener("click", function (event) {
  event.preventDefault();
  shuffle();
});

DOMSelectors.drawBtn.addEventListener("click", function (event) {
  event.preventDefault();
  draw(1);
});

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
