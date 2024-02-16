import { keyObj } from './keys.js';

console.log(keyObj);

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

document.addEventListener('DOMContentLoaded', () => {
  const wrapperEl = insertNode({ className: ['wrapper'] });
  const containerEl = insertNode({ parentNode: wrapperEl, className: ['container'] });
  const contentEl = insertNode({ parentNode: containerEl, className: ['content'] });
  insertNode({ parentNode: contentEl, tagName: 'textarea', className: ['textarea'] });
  insertNode({ parentNode: contentEl, className: ['keyboard'] });
  document.body.append(wrapperEl);

  const textarea = document.querySelector('.textarea');
  textarea.setAttribute('placeholder', 'Enter something...');
});
