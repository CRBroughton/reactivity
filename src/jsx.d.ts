type VNode = string | number | boolean | null | undefined | VNode[] | Component | HTMLElement;

interface DOMAttributes {
  children?: VNode[];
  onClick?: (event: MouseEvent) => void;
  onChange?: (event: Event) => void;
  onInput?: (event: Event) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
  onSubmit?: (event: Event) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  style?: Partial<CSSStyleDeclaration>;
  class?: string;
  className?: string;
  id?: string;
  type?: string;
  value?: string | number | boolean;
  disabled?: boolean;
  checked?: boolean;
  placeholder?: string;
  name?: string;
}

type HTMLAttributes = {
  [K in keyof HTMLElementTagNameMap]: DOMAttributes;
};

type Props = DOMAttributes & Record<string, unknown>;
type Component<P = object> = (props?: P) => JSXElement;

export interface JSXElement {
  type: string | Component;
  props: Props;
  children: VNode[];
}

declare global {
  namespace JSX {
    interface Element extends JSXElement {}
    interface IntrinsicElements extends HTMLAttributes {}
  }
}
