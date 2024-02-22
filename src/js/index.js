import { keyObj } from './keys.js';

const appendStyles = (path) => {
  let head = document.getElementsByTagName('head')[0];
  let link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.href = path;
  head.insertBefore(link, head.lastChild);
};
  
appendStyles('./css/style.css');

const insertNode = ({
  parentNode, tagName = 'div', className = [], textContent = ''
} = {}) => {
  const node = document.createElement(tagName);
  node.classList.add(...className);
  node.textContent = textContent;
  if (parentNode) {
    parentNode.append(node);
  }
  return node;
};

const makeButtonElement = (text, parentNode, dataAttr, className = []) => {
  const button = insertNode(
    {
      parentNode: parentNode,
      textContent: text, 
      tagName: 'button',
      className: className
    }
  );
  if (dataAttr) {
    button.setAttribute('data-key', `${dataAttr}`);
  }
  return button;
};

const specialKeyClasses = {
  Backspace: 'keyboard__key_backspace',
  Tab: 'keyboard__key_tab',
  Delete: 'keyboard__key_delete',
  CapsLock: 'keyboard__key_capslock',
  Space: 'keyboard__key_space',
  Enter: 'keyboard__key_enter',
  ShiftLeft: 'keyboard__key_leftShift',
  ShiftRight: 'keyboard__key_rightShift',
  ControlLeft: 'keyboard__key_controlLeft',
  ControlRight: 'keyboard__key_controlRight'
};

document.addEventListener('DOMContentLoaded', () => {
  const wrapperEl = insertNode({ className: ['wrapper'] });
  const containerEl = insertNode({ parentNode: wrapperEl, className: ['container'] });
  const contentEl = insertNode({ parentNode: containerEl, className: ['content'] });
  insertNode({ parentNode: contentEl, tagName: 'textarea', className: ['textarea'] });
  const keyboardEl = insertNode({ parentNode: contentEl, className: ['keyboard'] });
  const keyboardRow = insertNode({ parentNode: keyboardEl, className: ['keyboard__row'] });

  Object.entries(keyObj).forEach(([key, value]) => {
    if (specialKeyClasses[key]) {
      makeButtonElement(value, keyboardRow, key, ['keyboard__key', specialKeyClasses[key]]);
    } else {
      makeButtonElement(value, keyboardRow, key, ['keyboard__key']);
    }
  });

  document.body.append(wrapperEl);

  // console.log(buttons);
  const textarea = document.querySelector('.textarea');
  textarea.setAttribute('placeholder', 'Enter something...');
});
