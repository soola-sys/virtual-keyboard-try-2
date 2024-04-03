import insertNode from './insertNode.js';
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
export default makeButtonElement;
