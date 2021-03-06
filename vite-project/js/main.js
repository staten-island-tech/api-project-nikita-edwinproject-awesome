import "../styles/style.css";
import { apiLinks } from "./api-links";
import { DOMSelectors } from "./dom-selectors";

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
          if (card.value === "ACE" && path === "player_hand") {
            chooseAce(path, null, card.code);
          } else {
            keepScore(path, null);
          }
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

async function keepScore(path, ace) {
  try {
    const list = await fetchApi(
      `${apiLinks.baseURL}/${apiLinks.deck}/pile/${path}/list`
    );

    if (path === "player_hand") {
      let playerValue = 0;
      await list.piles.player_hand.cards.forEach(async (card) => {
        try {
          if (
            card.value === "JACK" ||
            card.value === "QUEEN" ||
            card.value === "KING"
          ) {
            playerValue += 10;
          } else if (card.value === "ACE") {
            if (ace != null) {
              playerValue += ace;
            } else if (DOMSelectors.body.classList.contains(`${card.code}11`)) {
              playerValue += 11;
            } else if (DOMSelectors.body.classList.contains(`${card.code}1`)) {
              playerValue += 1;
            }
          } else {
            playerValue += parseInt(card.value);
          }
        } catch (err) {
          console.log(err);
        }
      });
      // DOMSelectors.playerScore.textContent = playerValue;
      DOMSelectors.playerScore.innerHTML = `<h3>${playerValue}</h3>`;
      if (playerValue == 21 && DOMSelectors.playerHand.children.length === 2) {
        winOrLose("player-win");
      } else if (playerValue > 21) {
        winOrLose("dealer-win");
        DOMSelectors.body.classList.add("dealing");
        DOMSelectors.body.classList.remove("hit-stay");
      }
    } else if (path === "dealer_hand") {
      let dealerValue = 0;

      await list.piles.dealer_hand.cards.forEach(async (card) => {
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
      DOMSelectors.dealerScore.innerHTML = `<h3>${dealerValue}</h3>`;
    }
  } catch (err) {
    console.log(err);
  }
}

function winOrLose(condition) {
  console.log(condition); // make this insert to DOM and stuff
  DOMSelectors.body.classList.add("game-over", condition);
}

async function chooseAce(path, value, code) {
  try {
    DOMSelectors.body.classList.add("choose-ace");
    if (code != null) {
      if (value != null) {
        await keepScore(path, value);
        DOMSelectors.body.classList.remove("choose-ace");
        DOMSelectors.body.classList.add(`${code}${value}`);
        DOMSelectors.main.classList.remove(code);
      }
      DOMSelectors.main.classList.add(code);
    }
  } catch (err) {
    console.log(err);
  }
}

function shuffle() {
  const divs = ["player_hand", "dealer_hand"];

  divs.forEach((div) => {
    if (document.getElementById(div).children.length > 0) {
      while (document.getElementById(div).children.length > 0) {
        document.querySelector(".card").remove();
      }
    }
  });

  DOMSelectors.playerScore.textContent = "";
  DOMSelectors.dealerScore.textContent = "";

  DOMSelectors.body.classList.remove(
    "stay",
    "hit-stay",
    "game-over",
    "player-win",
    "dealer-win",
    "choose-ace",
    "AS11",
    "AS1",
    "AC11",
    "AC1",
    "AD11",
    "AD1",
    "AH11",
    "AH1"
  );
  DOMSelectors.body.classList.add("dealing");

  fetchApi(`${apiLinks.baseURL}/${apiLinks.deck}/${apiLinks.shuffle}`);
}

async function proceed() {
  try {
    if (DOMSelectors.body.classList.contains("game-over")) {
      shuffle();
    } else if (DOMSelectors.playerHand.children.length > 0) {
      if (DOMSelectors.dealerHand.children.length > 0) {
        if (DOMSelectors.playerHand.children.length > 1) {
          if (DOMSelectors.dealerHand.children.length === 1) {
            draw("dealer_hand", "down");
            console.log("Please hit or stay"); // make it insert this statement into the DOM somewhere idk
            DOMSelectors.body.classList.remove("dealing");
            DOMSelectors.body.classList.add("hit-stay");
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
            if (dealerValue <= 16) {
              draw("dealer_hand");
            } else if (dealerValue >= 22) {
              winOrLose("player-win");
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
                    if (
                      DOMSelectors.body.classList.contains(`${card.code}11`)
                    ) {
                      playerValue += 11;
                    } else if (
                      DOMSelectors.body.classList.contains(`${card.code}1`)
                    ) {
                      playerValue += 1;
                    }
                  } else {
                    playerValue += parseInt(card.value);
                  }
                } catch (err) {
                  console.log(err);
                }
              });
              if (dealerValue < playerValue && playerValue <= 21) {
                winOrLose("player-win");
              } else {
                winOrLose("dealer-win");
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
});

DOMSelectors.stayBtn.addEventListener("click", async function (event) {
  try {
    event.preventDefault();
    DOMSelectors.body.classList.remove("hit-stay");
    DOMSelectors.body.classList.add("stay");
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
          if (DOMSelectors.body.classList.contains(`${card.code}11`)) {
            playerValue += 11;
          } else if (DOMSelectors.body.classList.contains(`${card.code}1`)) {
            playerValue += 1;
          }
        } else {
          playerValue += parseInt(card.value);
        }
      } catch (err) {
        console.log(err);
      }
    });
    if (playerValue > 21) {
      winOrLose("dealer-win");
    } else {
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
        await keepScore("dealer_hand", null);
      });
      proceed();
    }
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
          if (DOMSelectors.body.classList.contains(`${card.code}11`)) {
            playerValue += 11;
          } else if (DOMSelectors.body.classList.contains(`${card.code}1`)) {
            playerValue += 1;
          }
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

DOMSelectors.ace11Btn.addEventListener("click", async function (event) {
  event.preventDefault();
  let code = DOMSelectors.main.classList;
  await chooseAce("player_hand", 11, code);
});

DOMSelectors.ace1Btn.addEventListener("click", async function (event) {
  event.preventDefault();
  let code = DOMSelectors.main.classList;
  await chooseAce("player_hand", 1, code);
});

export { fetchApi };
