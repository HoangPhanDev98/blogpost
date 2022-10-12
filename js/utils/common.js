export function setTextContent(parent, selector, text) {
  if (!parent) return;
  const element = parent.querySelector(selector);
  element.textContent = text;
}

export function truncate(text, maxLength) {
  if (text <= maxLength) return text;

  return `${text.slice(0, maxLength - 1)}…`;
}
