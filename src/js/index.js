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
  MetaLeft: 'keyboard__key_metakey',
  AltLeft: 'keyboard__key_altLeft',
  AltRight: 'keyboard__key_altRight',
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
      makeButtonElement(value, keyboardRow, key, ['keyboard__key', specialKeyClasses[key], 'extra-key']);
    } else {
      makeButtonElement(value, keyboardRow, key, ['keyboard__key']);
    }
  });
}

const onEnterPressed = () => {
  textAreaEl.value += '\n';
};

function onBackspacePressed(selStart, selEnd) {
  if (selEnd === textAreaEl.value.length && (selStart === selEnd)) {
    textAreaEl.value = textAreaEl.value.slice(0, textAreaEl.selectionEnd - 1);
  } else if (selStart === 0 && selEnd === 0) {
    textAreaEl.setSelectionRange(selStart, selStart);
  } else {
    let res = textAreaEl.value.slice(0, selStart - 1) + textAreaEl.value.slice(selEnd);
    textAreaEl.value = res;
    textAreaEl.focus();
    textAreaEl.setSelectionRange(selStart, selStart - 1);
  }
}

function onDelPressed(selStart, selEnd) {
  if (selEnd === textAreaEl.value.length && (selStart === selEnd)) {
    textAreaEl.setSelectionRange(selStart, selEnd);
  } else {
    let afterCaret = textAreaEl.value.slice(selEnd, textAreaEl.value.length).substring(1);
    let beforeCaret = textAreaEl.value.slice(0, selStart);
    let res = beforeCaret + afterCaret;
    textAreaEl.value = res;
    textAreaEl.focus();
    textAreaEl.setSelectionRange(selStart, selStart);
  }
}

function onTabPressed(selStart, selEnd) {
  if (selEnd === textAreaEl.value.length && (selStart === selEnd)) {
    textAreaEl.value += '    ';
  } else {
    let beforeCaret = textAreaEl.value.slice(0, selStart);
    let afterCaret = textAreaEl.value.slice(selEnd, textAreaEl.value.length);
    let res = beforeCaret + '    ' + afterCaret;
    textAreaEl.value = res;
    textAreaEl.focus();
    textAreaEl.setSelectionRange(selStart + 4, selStart + 4);
  } 
}

document.addEventListener('DOMContentLoaded', () => {
  let isLanguageSwitched = false;
  if (localStorage.getItem('lang') === 'ru') {
    switchLayout(rukeyObj);
  } else {
    switchLayout(keyObj);
  }
  document.addEventListener('keydown', (e) => {
    e.preventDefault();
    textAreaEl.focus();
    if (keyObj[e.code]) {
      let selectionStart = textAreaEl.selectionStart;
      let selectionEnd = textAreaEl.selectionEnd;
      let item = document.querySelector(`.keyboard__key[data-key='${e.code}']`);
      item.classList.add('active');
      setTimeout(() => item.classList.remove('active'), 100);
      if (!item.classList.contains('extra-key')) {
        if (selectionEnd === textAreaEl.value.length && (selectionStart === selectionEnd)) {
          textAreaEl.value += item.textContent;
        } else {
          let afterCaret = textAreaEl.value.slice(selectionEnd);
          let beforeCaret = textAreaEl.value.slice(0, selectionStart);
          let res = beforeCaret + item.textContent + afterCaret;
          textAreaEl.value = res;
          textAreaEl.setSelectionRange(selectionStart + 1, selectionStart + 1);
        }
      }
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
      if (e.code === 'Enter') {
        onEnterPressed(selectionStart, selectionEnd);
      }
      if (e.code === 'Backspace') {
        onBackspacePressed(selectionStart, selectionEnd);
      }
      if (e.code === 'Delete') {
        onDelPressed(selectionStart, selectionEnd);
      }
      if (e.code === 'Tab') {
        onTabPressed(selectionStart, selectionEnd);
      }
    }
  });
  document.body.append(wrapperEl);
});
