import "../styles/style.css";

const URL = "https://deckofcardsapi.com/api/deck/new/draw/?count=2";

async function getData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json(); // turns response in json we can use
    data.cards.forEach((card) => {
      console.log(card.image);
      document
        .getElementById("app")
        .insertAdjacentHTML("beforeend", `<img src="${card.image}" alt="">`);
    });
  } catch (err) {
    console.log(err);
  }
}

getData(URL);

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
