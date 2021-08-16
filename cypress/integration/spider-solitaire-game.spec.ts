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

  it("should drag and drop card", () => {
    const draggable = Cypress.$(
      ".onesuite > :nth-child(1) > :nth-last-child(1)"
    )[0]; // Pick up this
    const droppable = Cypress.$(
      ".onesuite > :nth-child(2) > :nth-last-child(1)"
    )[0]; // Drop over this
    console.log(draggable);
    const coords = droppable.getBoundingClientRect();

    draggable.dispatchEvent(new MouseEvent("mousedown"));
    draggable.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 10, clientY: 0 })
    );
    draggable.dispatchEvent(
      new MouseEvent("mousemove", {
        clientX: coords.x + 10,
        clientY: coords.y + 10, // A few extra pixels to get the ordering right
      })
    );
    draggable.dispatchEvent(new MouseEvent("mouseup"));
    cy.get(".onesuite > :nth-child(2) ").should("contain", "Get to work");
  });
});
