import { initGame } from "functions/reversed-spider-solitaire";


describe("Game functions test", () => {
  describe("initGame function test", () => {
    it("should return cards 104", () => {
      const game = initGame();

      expect(game.cards.length).toBe(104);
    });
    it("should return decks 10", () => {
      const game = initGame();

      expect(game.decks.length).toBe(11);
    });
    
  });
});
