export function createElement(tagName, attributes) {
    const element = document.createElement(tagName);
    
    if (attributes) {
    for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
    }
    }
    return element;
   }

