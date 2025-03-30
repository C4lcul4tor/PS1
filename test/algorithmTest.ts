import { AnswerDifficulty } from "../src/flashcards";
import { expect } from "chai";
import {
  toBucketSets,
  getBucketRange,
  practice,
  update,
  getHint,
  computeProgress
} from "../src/algorithm";
import { Flashcard, BucketMap } from "../src/flashcards";

function createCard(id: string): Flashcard {
  return {
    front: "front " + id,
    back: "back " + id,
    hint: "hint " + id,
    tags: []
  };
}


describe("Flashcard Algorithm Tests", () => {
  it("toBucketSets returns correct array of sets", () => {
    const cardA = createCard("A");
    const cardB = createCard("B");
    const map: BucketMap = new Map([
      [0, new Set([cardA])],
      [2, new Set([cardB])],
    ]);

    const result = toBucketSets(map);
    expect(result[0]?.has(cardA)).to.be.true;
    expect(result[2]?.has(cardB)).to.be.true;

  });

  it("getBucketRange returns correct min and max", () => {
    const map: BucketMap = new Map([
      [1, new Set()],
      [3, new Set()],
      [2, new Set()],
    ]);
    const [min, max] = getBucketRange(map);
    expect(min).to.equal(1);
    expect(max).to.equal(3);
  });

  it("practice returns a card from lowest non-empty bucket", () => {
    const card = createCard("A");
    const map: BucketMap = new Map([
      [2, new Set([card])]
    ]);
    expect(practice(map)).to.equal(card);
  });

  it("update moves card correctly based on difficulty", () => {
    const card = createCard("A");
    const map: BucketMap = new Map([[1, new Set([card])]]);
    update(map, card, AnswerDifficulty.Easy);    expect(map.get(2)?.has(card)).to.be.true;

    update(map, card, AnswerDifficulty.Hard);
    expect(map.get(1)?.has(card)).to.be.true;

    update(map, card, AnswerDifficulty.Forgot);
    expect(map.get(1)?.has(card)).to.be.true;
  });

  it("getHint returns hint from back", () => {
    const card: Flashcard = {
      
      front: "?",
      back: "Answer",
      hint: "This is a hint",
      tags: []
    };
    
    expect(getHint(card)).to.equal("Ans...");
  });

  it("computeProgress returns percentage of cards in highest bucket", () => {
    const card1 = createCard("A");
    const card2 = createCard("B");
    const map: BucketMap = new Map([
      [0, new Set([card1])],
      [3, new Set([card2])]
    ]);
    expect(computeProgress(map)).to.equal(50);
  });
});