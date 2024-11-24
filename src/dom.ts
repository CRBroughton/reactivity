type Props = Record<string, unknown>;
interface VNode {
  type: string;
  props: Props;
  children: Children;
}
type Children = (VNode | string)[];

// TODO - Try to implement some sort of VDOM
// function html(type: string, props: Props = {}, ...children: Children): VNode {
//   return {
//     type,
//     props,
//     children: children.flat(),
//   };
// }

// function text(content: string): string {
//   return content;
// }

type Style = Partial<CSSStyleDeclaration | Record<string, PropertyKey>>;
interface ElementProps {
  style?: Style;
  class?: string;
  className?: string;
  [key: PropertyKey]: any;
};
export function createElement(tag: string, props: ElementProps = {}): HTMLElement {
  const element = document.createElement(tag);

  if (props.className || props.class)
    element.className = props.className || props.class || '';

  if (props.style)
    Object.assign(element.style, props.style);

  Object.entries(props).forEach(([key, value]) => {
    if (key !== 'style' && key !== 'class' && key !== 'className')
      element.setAttribute(key, value);
  });

  return element;
}
