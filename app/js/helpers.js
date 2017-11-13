export { $parent, htmlToDOM };

/**
 * Will return DOM node from given string
 * 
 * @param {String} html 
 */
function htmlToDOM(html) {
   let parser = new DOMParser();
   let doc = parser.parseFromString(html, "text/html");
   return doc.body.firstChild;
}

/**
* Find and return the parent node of a given
* tag
* 
* @param {HTMLElement} element 
* @param {String} tagName 
*/

function $parent(element, tagName) {
   if (!element.parentNode) {
       return;
   }
   if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
       return element.parentNode;
   }
   return $parent(element.parentNode, tagName);
}
