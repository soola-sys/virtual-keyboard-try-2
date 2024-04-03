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
export default insertNode;
