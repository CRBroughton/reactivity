// Type definitions
import type { Component, JSXElement, Props, VNode } from './jsx';
import { createEffect } from './signals';

// createElement function for JSX
export function createElement(type: string | Component, props: Props | null, ...children: VNode[]): JSXElement {
  return {
    type,
    props: props || {},
    children: children.flat(),
  };
}

// DOM manipulation helpers
function setElementProps(element: HTMLElement, props: Props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(
        key.toLowerCase().slice(2),
        value as EventListener,
      );
    }
    else if (key === 'class' || key === 'className') {
      // Handle class and className props
      element.setAttribute('class', String(value));
    }
    else {
      element.setAttribute(key, String(value));
    }
  });
}

function isJSXElement(node: VNode | JSXElement): node is JSXElement {
  return typeof node === 'object' && node !== null && 'type' in node && 'props' in node && 'children' in node;
}
function appendChild(element: HTMLElement, child: VNode) {
  if (child == null)
    return;

  if (typeof child === 'function') {
    appendReactiveChild(element, child);
  }
  else if (isJSXElement(child)) {
    element.appendChild(createComponent(child));
  }
  else {
    element.appendChild(document.createTextNode(String(child)));
  }
}

function appendReactiveChild(element: HTMLElement, child: () => unknown) {
  const textNode = document.createTextNode('');
  createEffect(() => {
    textNode.textContent = String(child());
  });
  element.appendChild(textNode);
}

// Component creation
function createHTMLElement(jsxElement: JSXElement & { type: string }): HTMLElement {
  const element = document.createElement(jsxElement.type);
  setElementProps(element, jsxElement.props);
  jsxElement.children.forEach(child => appendChild(element, child));
  return element;
}

function createFunctionalComponent(jsxElement: JSXElement & { type: Component }): HTMLElement | Text {
  const result = jsxElement.type({
    ...jsxElement.props,
    children: jsxElement.children,
  });
  return createComponent(result);
}

function isHTMLComponent(jsxElement: JSXElement): jsxElement is JSXElement & { type: string } {
  return typeof jsxElement.type === 'string';
}
function isFunctionComponent(jsxElement: JSXElement): jsxElement is JSXElement & { type: Component } {
  return typeof jsxElement.type === 'function';
}
function createComponent(jsxElement: JSXElement): HTMLElement | Text {
  if (isHTMLComponent(jsxElement)) {
    return createHTMLElement(jsxElement);
  }
  else if (isFunctionComponent(jsxElement)) {
    return createFunctionalComponent(jsxElement);
  }
  else {
    throw new Error('Invalid component type');
  }
}

export function render(component: JSXElement, container: HTMLElement | null) {
  if (!container)
    throw new Error('Container element not found');
  container.appendChild(createComponent(component));
}
