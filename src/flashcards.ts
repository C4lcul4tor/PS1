export class Flashcard {

  public readonly front: string;
  public readonly back: string;
  public readonly hint: string; 
  public readonly tags: ReadonlyArray<string>;

  constructor(
    front: string,
    back: string,
    hint: string,
    tags: ReadonlyArray<string>
  ) {
    this.front = front;
    this.back = back;
    this.hint = hint;
    this.tags = tags;
  }
}

export enum AnswerDifficulty {
  Forgot = 0,
  Hard = 1,
  Easy = 2,
}

export type BucketMap = Map<number, Set<Flashcard>>;
