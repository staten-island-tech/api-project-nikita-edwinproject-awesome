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
      try {
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
      } catch (err) {
        console.log(err);
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

async function proceed() {
  try {
    if (DOMSelectors.playerHand.children.length > 0) {
      if (DOMSelectors.dealerHand.children.length > 0) {
        if (DOMSelectors.playerHand.children.length > 1) {
          if (DOMSelectors.dealerHand.children.length === 1) {
            draw("dealer_hand", "down");
            console.log("Please hit or stay"); // make it insert this statement into the DOM somewhere idk
          } else {
            const data = await fetchApi(
              `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.listDealerCards}`
            );
            let dealerValue = 0;
            await data.piles.dealer_hand.cards.forEach(async (card) => {
              try {
                if (
                  card.value === "JACK" ||
                  card.value === "QUEEN" ||
                  card.value === "KING"
                ) {
                  dealerValue += 10;
                } else if (card.value === "ACE") {
                  dealerValue += 11;
                } else {
                  dealerValue += parseInt(card.value);
                }
              } catch (err) {
                console.log(err);
              }
            });
            console.log(dealerValue);
            if (dealerValue <= 16) {
              draw("dealer_hand");
            } else if (dealerValue >= 22) {
              console.log("Dealer busts");
            } else {
              const data = await fetchApi(
                `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.listPlayerCards}`
              );
              let playerValue = 0;
              await data.piles.player_hand.cards.forEach(async (card) => {
                try {
                  if (
                    card.value === "JACK" ||
                    card.value === "QUEEN" ||
                    card.value === "KING"
                  ) {
                    playerValue += 10;
                  } else if (card.value === "ACE") {
                    playerValue += 11;
                  } else {
                    playerValue += parseInt(card.value);
                  }
                } catch (err) {
                  console.log(err);
                }
              });
              if (dealerValue < playerValue && playerValue <= 21) {
                console.log("player wins");
              } else {
                console.log("dealer wins");
              }
            }
          }
        } else {
          draw("player_hand");
        }
      } else {
        draw("dealer_hand");
      }
    } else {
      draw("player_hand");
    }
  } catch (err) {
    console.log(err);
  }
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
  try {
    event.preventDefault();
    DOMSelectors.body.classList.add("stay");
    const data = await fetchApi(
      `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.listDealerCards}`
    );
    while (DOMSelectors.dealerHand.children.length > 0) {
      DOMSelectors.dealerHand.querySelector(".card").remove();
    }
    await data.piles.dealer_hand.cards.forEach((card) => {
      DOMSelectors.dealerHand.insertAdjacentHTML(
        "beforeend",
        `<img src="${card.image}" alt="${card.value} of ${card.suit}" class="card" id="${card.code}">`
      );
    });
    proceed();
  } catch (err) {
    console.log(err);
  }
});

DOMSelectors.continueBtn.addEventListener("click", function (event) {
  event.preventDefault();
  proceed();
});

DOMSelectors.hitBtn.addEventListener("click", async function (event) {
  try {
    event.preventDefault();
    const data = await fetchApi(
      `${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.listPlayerCards}`
    );
    let playerValue = 0;
    await data.piles.player_hand.cards.forEach(async (card) => {
      try {
        if (
          card.value === "JACK" ||
          card.value === "QUEEN" ||
          card.value === "KING"
        ) {
          playerValue += 10;
        } else if (card.value === "ACE") {
          playerValue += 11;
        } else {
          playerValue += parseInt(card.value);
        }
      } catch (err) {
        console.log(err);
      }
    });
    if (playerValue < 21) {
      draw("player_hand");
    }
  } catch (err) {
    console.log(err);
  }
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
