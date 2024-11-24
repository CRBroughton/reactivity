type Props = Record<string, unknown>;
interface VNode {
  type: string;
  props: Props;
  children: Children;
}
type Children = (VNode | string)[];

function html(type: string, props: Props = {}, ...children: Children): VNode {
  return {
    type,
    props,
    children: children.flat(),
  };
}

function text(content: string): string {
  return content;
}
