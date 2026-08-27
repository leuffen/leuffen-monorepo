declare module '@nextrap/nte-dialog-component' {
  import type { TemplateResult } from 'lit';

  export interface NteDialogComponentOptions {
    dialogClass?: string | string[];
    dismiss?:
      | false
      | {
          closeButton?: boolean;
          escape?: boolean;
          backdrop?: 'close' | 'shake' | 'none';
        };
  }

  export abstract class NteDialogComponent<
    TInput = void,
    TResult = void,
  > extends HTMLElement {
    protected input: TInput;
    protected readonly resultType?: TResult;
    protected dialogOptions: NteDialogComponentOptions;
    static show<T>(
      input: T,
    ): Promise<{ submitted: true; data: void } | { submitted: false }>;
    protected abort(): void;
    protected renderTitle(): TemplateResult | string | null;
    protected abstract renderDialog(): TemplateResult;
    protected renderFooter(): TemplateResult | null;
  }
}
