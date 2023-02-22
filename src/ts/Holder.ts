/* eslint-disable @typescript-eslint/no-explicit-any */
export default abstract class Holder<T> {
  protected _collection: T[];

  public constructor(args?: any) {
    this._collection = [];

    this.postInitialization(args);
  }

  abstract postInitialization(args: any): void;

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
