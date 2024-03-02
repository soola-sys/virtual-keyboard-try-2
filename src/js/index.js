import { keyObj } from './keys.js';
import { rukeyObj } from './rukeys.js';

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

const wrapperEl = insertNode({ className: ['wrapper'] });
const containerEl = insertNode({ parentNode: wrapperEl, className: ['container'] });
const contentEl = insertNode({ parentNode: containerEl, className: ['content'] });
const textAreaEl = insertNode({ parentNode: contentEl, tagName: 'textarea', className: ['textarea'] });
textAreaEl.setAttribute('placeholder', 'Enter something...');
const keyboardEl = insertNode({ parentNode: contentEl, className: ['keyboard'] });
const keyboardRow = insertNode({ parentNode: keyboardEl, className: ['keyboard__row'] });

function switchLayout(keyMap) {
  keyboardRow.innerHTML = '';
  Object.entries(keyMap).forEach(([key, value]) => {
    if (specialKeyClasses[key]) {
      makeButtonElement(value, keyboardRow, key, ['keyboard__key', specialKeyClasses[key]]);
    } else {
      makeButtonElement(value, keyboardRow, key, ['keyboard__key']);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  let isLanguageSwitched = false;
  if (localStorage.getItem('lang') === 'ru') {
    switchLayout(rukeyObj);
  } else {
    switchLayout(keyObj);
  }
  document.addEventListener('keydown', (e) => {
    if (keyObj[e.code]) {
      let item = document.querySelector(`.keyboard__key[data-key='${e.code}']`);
      item.classList.add('active');
      setTimeout(() => item.classList.remove('active'), 100);
      if (e.ctrlKey && e.altKey) {
        if (!isLanguageSwitched) {
          switchLayout(rukeyObj);
          isLanguageSwitched = true;
          localStorage.setItem('lang', 'ru');
        } else {
          switchLayout(keyObj);
          isLanguageSwitched = false;
          localStorage.setItem('lang', 'en');
        }
      }
    }
  });
  document.body.append(wrapperEl);
  // localStorage.clear();
});
