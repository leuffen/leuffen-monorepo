export abstract class NteDialogComponent<TInput = void, TResult = void> extends HTMLElement {
  protected input!: TInput;
  protected declare readonly resultType?: TResult;

  static async show<T>(_input: T): Promise<{ submitted: true; data: void } | { submitted: false }> {
    return { submitted: false };
  }

  protected abort(): void {
    return undefined;
  }
}
