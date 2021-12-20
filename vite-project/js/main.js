import "../styles/style.css";
import { apiLinks } from "./api-links";
import { DOMSelectors } from "./dom-selectors";

/* draw() accepts an argument of a path for the pile which you want to add the card to. draw(player_hand) draws to player_hand. When drawing to the pile drawn_cards, you can transfer those cards with the functions transferToPlayer() and transferToDealer(). NOTE: Those functions transfer all of the cards in drawn_cards to the respective piles they are transferring to. */

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

async function draw(path, direction) {
  try {
    const data = await fetchApi(
      `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.draw}1`
    );
    data.cards.forEach(async (card) => {
      console.log(path);
      await fetchApi(
        `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.addToDrawnCards}${card.code}`
      );
      /* if (path === "player_hand") {
        transferToPlayer();
      } else if (path === "dealer_hand") {
        transferToDealer();
      } else {
        console.log("Please specify path");
      } */
      if (direction === undefined || direction === "up") {
        document
          .getElementById(path)
          .insertAdjacentHTML(
            "beforeend",
            `<img src="${card.image}" alt="${card.value} of ${card.suit}" class="card" id="${card.code}">`
          );
      } else if (direction === "down") {
        document
          .getElementById(path)
          .insertAdjacentHTML(
            "beforeend",
            `<img src="/card-back.png" alt="Face down card" class="card" id="face-down">`
          );
      }
    });
  } catch (err) {
    console.log(err);
  }
}

function shuffle() {
  const divs = ["drawn_cards", "player_hand", "dealer_hand"];

  divs.forEach((div) => {
    if (document.getElementById(div).children.length > 0) {
      while (document.getElementById(div).children.length > 0) {
        document.querySelector(".card").remove();
      }
    }
  });

  fetchApi(`${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.shuffle}`);
}

async function transferToPlayer() {
  try {
    const response = await fetch(
      `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.listDrawnCards}`
    );
    const data = await response.json();
    if (data.piles.drawn_cards.cards.length > 0) {
      data.piles.drawn_cards.cards.forEach((card) => {
        fetchApi(
          `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.addToPlayer}${card.code}`
        );
      });
      transferToPlayer(); // finally makes it work!!
    } else {
      console.log("no cards drawn");
      fetchApi(
        `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.listPlayerCards}`
      );
    }
  } catch (err) {
    console.log(err);
  }
}

async function transferToDealer() {
  try {
    const response = await fetch(
      `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.listDrawnCards}`
    );
    const data = await response.json();
    if (data.piles.drawn_cards.cards.length > 0) {
      data.piles.drawn_cards.cards.forEach((card) => {
        fetchApi(
          `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.addToDealer}${card.code}`
        );
        /* document.querySelector(".card").remove();
        DOMSelectors.dealerHand.insertAdjacentHTML(
          "beforeend",
          `<img src="${card.image}" alt="${card.value} of ${card.suit}" class="card" id="${card.code}">`
        ); */
      });
      transferToDealer(); // finally makes it work!!
    } else {
      console.log("no cards drawn");
      fetchApi(
        `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.listDealerCards}`
      );
    }
  } catch (err) {
    console.log(err);
  }
}

async function dealBlackJack() {
  await draw("drawn_cards");
  await draw("drawn_cards");
  await transferToPlayer();
  await draw("drawn_cards");
  await draw("drawn_cards", "down");
  await transferToDealer();
  await fetchApi(
    `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.listDealerCards}`
  );
}

DOMSelectors.shuffleBtn.addEventListener("click", function (event) {
  event.preventDefault();
  shuffle();
});

DOMSelectors.drawBtn.addEventListener("click", function (event) {
  event.preventDefault();
  draw("drawn_cards");
});

DOMSelectors.transferToPlayerBtn.addEventListener(
  "click",
  async function (event) {
    event.preventDefault();
    await transferToPlayer();
  }
);

DOMSelectors.logBtn.addEventListener("click", async function (event) {
  event.preventDefault();
  // fetchApi(`${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.listDrawnCards}`);
  // await dealBlackJack();
  await transferToDealer();
});

/* function greet(name) {
  const greetPromise = new Promise(function (resolve, reject) {
    resolve(`hello ${name}`);
  });
  return greetPromise;
}

const suzie = greet("Suzie");

suzie.then((result) => {
  console.log(result);
});
 */
