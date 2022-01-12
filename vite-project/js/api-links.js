import { fetchApi } from "./main";

const apiLinks = {
  baseURL: "https://deckofcardsapi.com/api/deck",
  deck: "gdh738kbjx9v", // this should remain relatively dynamic
  draw: "draw/?count=",
  addToDrawnCards: "pile/drawn_cards/add/?cards=",
  addToPlayer: "pile/player_hand/add/?cards=",
  addToDealer: "pile/dealer_hand/add/?cards=",
  listDrawnCards: "pile/drawn_cards/list",
  listPlayerCards: "pile/player_hand/list",
  listDealerCards: "pile/dealer_hand/list",
  shuffle: "shuffle",
  shuffleRemaining: "shuffle/?remaining=true",
};

async function newId() {
  try {
    const data = await fetchApi(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    );
    apiLinks.deck = data.deck_id;
  } catch (err) {
    console.log(err);
  }
}

newId();

export { apiLinks }; // in main.js, use these values in `` to create the links easier
