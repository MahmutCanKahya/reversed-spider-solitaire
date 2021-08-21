/// <reference types="cypress"/>

const SPIDER_SOLITAIRE_GAME_PAGE =
  "https://reversed-spider-solitaire.herokuapp.com/game/";

describe("gamepage-tests", () => {
  beforeEach(() => {
    cy.visit(SPIDER_SOLITAIRE_GAME_PAGE);
  });

  it("should open solitaire GAME page", () => {
    const currentUrl = cy.url();

    currentUrl.should("equal", SPIDER_SOLITAIRE_GAME_PAGE);
  });

  it("should have title REVERSED SPIDER SOLITAIRE on navbar", () => {
    cy.get(".title").should("contain", "REVERSED SPIDER SOLITAIRE");
  });

  it("should change border color red when dragenter event", () => {
    const card = cy
      .get(".onesuite > :nth-child(4) > :nth-last-child(1)")
      .children();

    card.should("have.css", "border", "1px solid rgb(0, 0, 0)");

    card.trigger("dragenter", { force: true });

    card.should("have.css", "border", "2px solid rgb(255, 0, 0)");
  });

  it("should scale card when clicked", () => {
    const card = cy.get(".onesuite > :nth-child(1) > :nth-last-child(1)");

    card.should("have.css", "transform", "none");

    card.trigger("click", {
      force: true,
    });

    cy.get(".onesuite > :nth-child(1) > :nth-last-child(1)")
      .children()
      .should("have.css", "transform", "matrix(1.1, 0, 0, 1.1, 0, 0)");
  });

  it("should remainder cards size decrease when clicked remainder cards", () => {
    cy.get(".card__remcards").its("length").should("equal", 5);
    cy.get(".card__remcards").last().trigger("click");
    cy.get(".card__remcards").its("length").should("equal", 4);
    cy.get(".card__remcards").last().trigger("click");
    cy.get(".card__remcards").its("length").should("equal", 3);
    cy.get(".card__remcards").last().trigger("click");
    cy.get(".card__remcards").its("length").should("equal", 2);
    cy.get(".card__remcards").last().trigger("click");
    cy.get(".card__remcards").its("length").should("equal", 1);
    cy.get(".card__remcards").last().trigger("click");
    cy.get(".card__remcards").should("not.exist");
  });

  it("should change color when clicked hint", () => {
    cy.get(".hint-text").contains("Hint OFF");
    cy.get(".hint").trigger("click");
    cy.get(".hint-text").should("contain", "Hint ON");
  });

  it("shoud be 10 decks", () => {
    cy.get(".onesuite > div").should("have.length", 10);
  });
  
  it("should first four deck be 6 card and last six decks 5 card", () => {
    cy.get(".onesuite > div").each(($li, index, $list) => {
      var val = 5;
      if (index < 4) {
        val = 6;
      }
      expect($li.children().length).equal(val);
    });
  });
});
