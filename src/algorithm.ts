import { Flashcard, AnswerDifficulty, BucketMap } from "./flashcards";

export function toBucketSets(map: BucketMap): Set<Flashcard>[] {
  const maxBucket = Math.max(...Array.from(map.keys()), 0);
  const buckets: Set<Flashcard>[] = Array.from({ length: maxBucket + 1 }, () => new Set());

  for (const [bucket, flashcards] of map.entries()) {
    buckets[bucket] = flashcards;
  }

  return buckets;
}


export function getBucketRange(map: BucketMap): [number, number] {
  if (map.size === 0) return [0, 0];
  const keys = Array.from(map.keys());
  return [Math.min(...keys), Math.max(...keys)];
}


export function practice(map: BucketMap): Flashcard | undefined {
  const sortedBuckets = Array.from(map.keys()).sort((a, b) => a - b);

  for (const bucket of sortedBuckets) {
    const cards = map.get(bucket);
    if (cards && cards.size > 0) {
      return cards.values().next().value;
    }
  }

  return undefined;
}


export function update(map: BucketMap, card: Flashcard, difficulty: AnswerDifficulty): void {
  let currentBucket = -1;
  for (const [bucket, cards] of map.entries()) {
    if (cards.has(card)) {
      currentBucket = bucket;
      cards.delete(card);
      break;
    }
  }

  if (currentBucket === -1) {
    currentBucket = 0;
  }

  let newBucket = currentBucket;
  if (difficulty === AnswerDifficulty.Easy) {
    newBucket++;
  } else if (difficulty === AnswerDifficulty.Hard) {
    newBucket = Math.max(0, currentBucket - 1);
  }

  if (!map.has(newBucket)) {
    map.set(newBucket, new Set());
  }
  map.get(newBucket)?.add(card);
}


export function getHint(card: Flashcard): string {
  return card.back.length <= 3 ? card.back : card.back.slice(0, 3) + "...";
}


export function computeProgress(map: BucketMap): number {
  let total = 0;
  let highest = 0;
  let highestCount = 0;

  for (const [bucket, cards] of map.entries()) {
    total += cards.size;
    if (bucket > highest) {
      highest = bucket;
      highestCount = cards.size;
    } else if (bucket === highest) {
      highestCount += cards.size;
    }
  }

  return total === 0 ? 100 : Math.round((highestCount / total) * 100);
}