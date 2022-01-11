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
  ace1Btn: document.getElementById("ace1"),
  ace11Btn: document.getElementById("ace11"),
  card: document.querySelector(".card"),
  allCards: document.querySelectorAll(".card"),
  dealerHand: document.getElementById("dealer_hand"),
  playerHand: document.getElementById("player_hand"),
  // drawnCards: document.getElementById("drawn_cards"),
  playerScore: document.getElementById("player_score"),
  dealerScore: document.getElementById("dealer_score"),
  playerScoreValue: document.getElementById("player_score_value").textContent,
};

export { DOMSelectors };
