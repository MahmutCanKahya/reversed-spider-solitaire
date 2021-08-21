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

  it("should each decks size increase when clicked remainder cards", () => {
    cy.get(".remainderCard").each((i) => {
      console.log(i);
    });
    cy.get(".card__remcards").its("length").should("equal", 5);
    cy.get(".card__remcards").last().trigger("click");
    cy.get(".card__remcards").its("length").should("equal", 4);
  });
});
