import { createElement } from '../dom';
import { createSignal } from '../signals';

interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  type?: string;
  class?: string;
}

export function Input({
  value: initialValue = '',
  onChange,
  placeholder,
  label,
  type = 'text',
  class: className = '',
}: InputProps) {
  const [value, setValue] = createSignal(initialValue);

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setValue(target.value);
    onChange?.(target.value);
  };

  return (
    <div class="flex flex-col gap-2">
      {label && <label class="text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        value={value()}
        onInput={handleInput}
        placeholder={placeholder}
        class={`px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
      />
    </div>
  );
}
