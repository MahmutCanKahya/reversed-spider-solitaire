/// <reference types="cypress" />

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

  it("should have PLAY GAME button", () => {
    cy.get("body").contains("PLAY GAME");
  });
});
