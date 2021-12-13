const apiLinks = {
  baseURL: "https://deckofcardsapi.com/api/deck",
  deck: "x9rzbivz6arg",
  draw: "draw/?count=",
  addToDrawnCards: "pile/drawn_cards/add/?cards=",
  addToPlayer: "pile/player_hand/add/?cards=",
  listDrawnCards: "pile/drawn_cards/list",
  shuffle: "shuffle",
  shuffleRemaining: "shuffle/?remaining=true",
};

export { apiLinks }; // in main.js, use these values in `` to create the links easier
