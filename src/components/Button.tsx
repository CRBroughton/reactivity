import { createElement } from '../dom';

interface ButtonProps {
  text: string;
  click: (event: MouseEvent) => void;

}
export function Button(props: ButtonProps) {
  return (
    <button
      class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
      onClick={props.click}
    >
      {props.text}
    </button>
  );
}
