import "../styles/style.css";
import { apiLinks } from "./api-links";
import { DOMSelectors } from "./dom-selectors";

/* NEXT STEP:: Make an enormous conditional statement that progresses the game. Make it do all of the card drawing until player chooses to hit/stay. There will be a button that you can press to trigger this function and progress the whole game. Part of this function will be to check score, especially to tell whether dealer should hit or stay. Also add functionality to the hit and/or stay button that tells whether you have busted/gotten a blackjack. */

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
        `${apiLinks.baseURL}/${apiLinks.deck}/pile/${path}/add/?cards=${card.code}`
      );
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
  DOMSelectors.body.classList.remove("stay");
});

DOMSelectors.drawPlayerBtn.addEventListener("click", function (event) {
  event.preventDefault();
  if (!DOMSelectors.body.classList.contains("stay")) {
    draw("player_hand");
  }
});

DOMSelectors.drawDealerBtn.addEventListener("click", function (event) {
  event.preventDefault();
  if (DOMSelectors.dealerHand.children.length === 1) {
    draw("dealer_hand", "down");
  } else {
    draw("dealer_hand");
  }
});

DOMSelectors.logBtn.addEventListener("click", function (event) {
  event.preventDefault();
  fetchApi(`${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.listPlayerCards}`);
  // await dealBlackJack();
  // await transferToDealer();
});

DOMSelectors.stayBtn.addEventListener("click", async function (event) {
  event.preventDefault();
  DOMSelectors.body.classList.add("stay");
  const data = await fetchApi(
    `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.listDealerCards}`
  );
  while (DOMSelectors.dealerHand.children.length > 0) {
    DOMSelectors.dealerHand.querySelector(".card").remove();
  }
  await data.piles.dealer_hand.cards.forEach(async (card) => {
    DOMSelectors.dealerHand.insertAdjacentHTML(
      "beforeend",
      `<img src="${card.image}" alt="${card.value} of ${card.suit}" class="card" id="${card.code}">`
    );
  });
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
