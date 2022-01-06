const DOMSelectors = {
  body: document.querySelector("body"),
  main: document.getElementById("main"),
  shuffleBtn: document.getElementById("shuffleBtn"),
  // drawPlayerBtn: document.getElementById("drawPlayerBtn"),
  // drawDealerBtn: document.getElementById("drawDealerBtn"),
  stayBtn: document.getElementById("stayBtn"),
  hitBtn: document.getElementById("hitBtn"),
  // logBtn: document.getElementById("logBtn"),
  continueBtn: document.getElementById("continueBtn"),
  card: document.querySelector(".card"),
  allCards: document.querySelectorAll(".card"),
  dealerHand: document.getElementById("dealer_hand"),
  playerHand: document.getElementById("player_hand"),
  // drawnCards: document.getElementById("drawn_cards"),
  playerScore: document.getElementById("player_score"),
  dealerScore: document.getElementById("dealer_score"),
};

export { DOMSelectors };
