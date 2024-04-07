import { keyObj } from './keys.js';
import { rukeyObj } from './rukeys.js';
import { shiftKeys } from './shiftKeys.js';
import { shiftKeysRu } from './shiftKeysRu.js';
import { specialKeyClasses } from './keyClassObj.js';
import insertNode from '../modules/insertNode.js';
import makeButtonElement from '../modules/makeButtonElement.js';

const wrapperEl = insertNode({ className: ['wrapper'] });
const containerEl = insertNode({ parentNode: wrapperEl, className: ['container'] });
const contentEl = insertNode({ parentNode: containerEl, className: ['content'] });
const textAreaEl = insertNode({ parentNode: contentEl, tagName: 'textarea', className: ['textarea'] });
const keyboardEl = insertNode({ parentNode: contentEl, className: ['keyboard'] });
const keyboardRow = insertNode({ parentNode: keyboardEl, className: ['keyboard__row'] });

textAreaEl.setAttribute('placeholder', 'Enter something...');
textAreaEl.setAttribute('autofocus', '');

const keyboardState = {
  isLanguageSwitched: false,
  shiftPressed: false,
  capsLockPressed: false,
  keys: []
};

const switchLayout = (keyMap) => {
  keyboardRow.innerHTML = '';
  Object.entries(keyMap).forEach(([key, value]) => {
    if (specialKeyClasses[key]) {
      makeButtonElement(value, keyboardRow, key, ['keyboard__key', specialKeyClasses[key], 'extra-key']);
      keyboardState.keys.push(key);
    } else {
      makeButtonElement(value, keyboardRow, key, ['keyboard__key']);
    }
  });
};

const onEnterPressed = (selStart, selEnd) => {
  let afterCaret = textAreaEl.value.slice(selEnd, textAreaEl.value.length);
  let beforeCaret = textAreaEl.value.slice(0, selStart);
  if (selStart === 0 && selEnd === 0) {
    let res = textAreaEl.value;
    textAreaEl.value = '\n' + res;
    textAreaEl.setSelectionRange(1, 1); 
  } else {
    textAreaEl.value = beforeCaret + '\n' + afterCaret;
    let newLineIndexStart = beforeCaret.length + 1;
    let newLineIndexEnd = newLineIndexStart;
    textAreaEl.setSelectionRange(newLineIndexStart, newLineIndexEnd);
  }
};

const onBackspacePressed = (selStart, selEnd) => {
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
};

const onDelPressed = (selStart, selEnd) => {
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
};

const onTabPressed = (selStart, selEnd, numberOfSpaces) => {
  let str = [...Array(numberOfSpaces)].fill(' ').join('');
  if (selEnd === textAreaEl.value.length && (selStart === selEnd)) {
    textAreaEl.value += str;
  } else {
    let beforeCaret = textAreaEl.value.slice(0, selStart);
    let afterCaret = textAreaEl.value.slice(selEnd, textAreaEl.value.length);
    let res = beforeCaret + str + afterCaret;
    textAreaEl.value = res;
    textAreaEl.focus();
    textAreaEl.setSelectionRange(selStart + numberOfSpaces, selStart + numberOfSpaces);
  } 
};

const setDefaulCaret = (selStart, selEnd, item) => {
  if (selEnd === textAreaEl.value.length && (selStart === selEnd)) {
    textAreaEl.value += item.textContent;
  } else {
    let afterCaret = textAreaEl.value.slice(selEnd);
    let beforeCaret = textAreaEl.value.slice(0, selStart);
    let res = beforeCaret + item.textContent + afterCaret;
    textAreaEl.value = res;
    textAreaEl.focus();
    textAreaEl.setSelectionRange(selStart + 1, selStart + 1);
  }
  return item;
};

const switchKeyboardLang = (eng, ru) => {
  if (localStorage.getItem('lang') !== 'ru') {
    switchLayout(eng);
  } else {
    switchLayout(ru);
  }
};

const toggleShiftKey = (event, shiftState, engKeys, ruKeys) => {
  if ((event.code === 'ShiftLeft' || event.code === 'ShiftRight') && keyboardState.isShiftPressed !== shiftState) {
    keyboardState.isShiftPressed = shiftState;
    switchKeyboardLang(engKeys, ruKeys);
  } 
};
const setLocalStorageState = (keyObject, langState, lang) => {
  switchLayout(keyObject);
  keyboardState.isLanguageSwitched = langState;
  localStorage.setItem('lang', lang);
};

const onCapslockClick = (keysArr) => {
  keyboardState.capsLockPressed = !keyboardState.capsLockPressed;
  keysArr.forEach((element) => {
    let key = element;
    if (!key.classList.contains('extra-key')) {
      if (keyboardState.capsLockPressed) {
        key.textContent = key.textContent.toUpperCase();
      } else {
        key.textContent = key.textContent.toLowerCase();
      }
    }
  });
  return keysArr;
};

const keyHandlers = {
  Enter: onEnterPressed,
  Backspace: onBackspacePressed,
  Delete: onDelPressed
};

document.addEventListener('DOMContentLoaded', () => {
  switchKeyboardLang(keyObj, rukeyObj);
  document.addEventListener('keydown', (e) => {
    e.preventDefault();
    textAreaEl.focus();
    const keys = document.querySelectorAll('.keyboard__key');
    if (keyObj[e.code]) {
      const selectionStart = textAreaEl.selectionStart;
      const selectionEnd = textAreaEl.selectionEnd;
      let item = document.querySelector(`.keyboard__key[data-key='${e.code}']`); 
      if (!item.classList.contains('extra-key')) {
        setDefaulCaret(selectionStart, selectionEnd, item);
      }
      if (e.code === 'CapsLock') {
        keyboardState.capsLockPressed = !keyboardState.capsLockPressed;
        keys.forEach((element) => {
          let key = element;
          if (!key.classList.contains('extra-key')) {
            if (e.getModifierState('CapsLock')) {
              key.textContent = key.textContent.toUpperCase();
            } else {
              key.textContent = key.textContent.toLowerCase();
            }
          }
        });
        document.querySelector(`.keyboard__key[data-key='${e.code}']`).classList.toggle('keyboard__key_active');
      }

      if (e.ctrlKey && e.altKey) {
        if (!keyboardState.isLanguageSwitched) {
          setLocalStorageState(rukeyObj, true, 'ru');
        } else {
          setLocalStorageState(keyObj, false, 'en');
        }
      }
      const keyHandler = keyHandlers[e.code];
      if (keyHandler) {
        keyHandler(selectionStart, selectionEnd);
      }
      if (e.code === 'Tab') {
        onTabPressed(selectionStart, selectionEnd, 4);
      }
      if (e.code === 'Space') {
        onTabPressed(selectionStart, selectionEnd, 1);
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    toggleShiftKey(e, true, shiftKeys, shiftKeysRu);
    let shiftStyles = document.querySelector(`.keyboard__key[data-key='${e.code}']`);
    shiftStyles.classList.add('active');
  });
  document.addEventListener('keyup', (e) => {
    toggleShiftKey(e, false, keyObj, rukeyObj);
    let shiftUp = document.querySelector(`.keyboard__key[data-key='${e.code}']`);
    if (shiftUp.classList.contains('active')) {
      shiftUp.classList.remove('active');
    }
  });

  document.addEventListener('click', (e) => {
    e.preventDefault();
    textAreaEl.focus();
    let activeKey = e.target;
    const newKeys = document.querySelectorAll('.keyboard__key');
    if (activeKey.classList.contains('keyboard__key')) {
      activeKey.classList.add('active');
      setTimeout(() => activeKey.classList.remove('active'), 100);
      if (!e.target.classList.contains('extra-key')) {
        setDefaulCaret(textAreaEl.selectionStart, textAreaEl.selectionEnd, activeKey);
      }
      if (e.target.dataset.key === 'CapsLock') {
        onCapslockClick(newKeys, e);
        e.target.classList.toggle('keyboard__key_active', keyboardState.capsLockPressed);
      }
      const eventKeyHandler = keyHandlers[e.target.dataset.key];
      if (eventKeyHandler) {
        eventKeyHandler(textAreaEl.selectionStart, textAreaEl.selectionEnd);
      }
      if (e.target.dataset.key === 'Tab') {
        onTabPressed(textAreaEl.selectionStart, textAreaEl.selectionEnd, 4);
      }
      if (e.target.dataset.key === 'Space') {
        onTabPressed(textAreaEl.selectionStart, textAreaEl.selectionEnd, 1);
      }
      if (e.target.dataset.key === 'ShiftLeft' || e.target.dataset.key === 'ShiftRight') {
        if (!keyboardState.isShiftPressed) {
          keyboardState.isShiftPressed = true;
          switchKeyboardLang(shiftKeys, shiftKeysRu);
          document.querySelector(`.keyboard__key[data-key='${e.target.dataset.key}']`).classList.add('keyboard__key_active'); 
        } else if (keyboardState.isShiftPressed) {
          keyboardState.isShiftPressed = false;
          switchKeyboardLang(keyObj, rukeyObj);
          document.querySelector(`.keyboard__key[data-key='${e.target.dataset.key}']`).classList.remove('keyboard__key_active'); 
        }
      }
    }
  });
  document.body.append(wrapperEl);
});
