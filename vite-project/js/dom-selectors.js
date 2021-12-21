const DOMSelectors = {
  body: document.querySelector("body"),
  main: document.getElementById("main"),
  shuffleBtn: document.getElementById("shuffleBtn"),
  drawPlayerBtn: document.getElementById("drawPlayerBtn"),
  drawDealerBtn: document.getElementById("drawDealerBtn"),
  stayBtn: document.getElementById("stayBtn"),
  logBtn: document.getElementById("logBtn"),
  card: document.querySelector(".card"),
  allCards: document.querySelectorAll(".card"),
  dealerHand: document.getElementById("dealer_hand"),
  playerHand: document.getElementById("player_hand"),
  drawnCards: document.getElementById("drawn_cards"),
};

export { DOMSelectors };
