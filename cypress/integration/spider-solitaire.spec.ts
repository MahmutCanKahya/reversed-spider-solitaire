/// <reference types="cypress" />

const SPIDER_SOLITAIRE_HOME_PAGE =
  "https://reversed-spider-solitaire.herokuapp.com/";

describe("homepage-tests", () => {
  beforeEach(() => {
    cy.visit(SPIDER_SOLITAIRE_HOME_PAGE);
  });

  it("should open solitaire home page", () => {
    const currentUrl = cy.url();

    currentUrl.should("equal", SPIDER_SOLITAIRE_HOME_PAGE);
  });

  it("should have title 'Best Score:' on solitaire homepage", () => {
    const title = cy.title();

    title.should("equel", "Reversed Spider Solitaire");
  });
});
