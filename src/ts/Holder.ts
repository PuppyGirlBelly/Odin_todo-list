export interface HolderArgs {
  title: string;
}

type childArgs = HolderArgs;

export abstract class Holder<T> {
  title: string;

  protected _collection: T[];

  public constructor(args: HolderArgs) {
    this.title = args.title;

    this.postInitialization(args);
  }

  abstract postInitialization(args: childArgs): void;

  add(item: T): void {
    this._collection.push(item);
  }

  remove(item: T) {
    const i = this._collection.indexOf(item);
    this._collection.splice(i, 1);
  }

  length(): number {
    return this._collection.length;
  }

  abstract list(item: T): void;
}
