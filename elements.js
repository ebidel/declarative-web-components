// Eric Bidelman <ebidel@>

'use strict';

class ShadowRootElement extends HTMLElement {
  static get is() { return 'shadow-root'; }

  constructor() {
    super();

    const parent = this.parentElement;
    const hasCustomElementAsHost = parent.localName === DefineCustomElementElement.is;
    if (!hasCustomElementAsHost) {
      this.addShadowRootTo(parent);
      parent.removeChild(this); // Cleanup. Remove <shadow-root> from host's light dom.
    }
  }

  addShadowRootTo(parent) {
    this._tmpl = this.querySelector('template');
    const clone = document.importNode(this._tmpl.content, true);
    parent._shadowRootEl = this;
    return parent.attachShadow({mode: 'open'}).appendChild(clone);
  }
}

class DefineCustomElementElement extends HTMLElement {
  static get is() { return 'custom-element-definition'; }

  constructor() {
    super();

    const tagName = this.getAttribute('name');
    if (!tagName) {
      throw Error('No tag name. Please provide a name attribute.');
    }

    // Attach DOM content to element instances on the page.
    Array.from(document.querySelectorAll(tagName)).forEach(el => {
      this._addDOM(el);
    });

    // If the element defines a script, use it to register the element.
    // TODO: support <script src> use cases.
    const script = this.querySelector(':scope > script');
    if (script) {
      if (!script.text.match(/class(\s+\w+\s+|\s+)extends\s+HTMLElement/)) {
        throw Error(`<${DefineCustomElementElement.is} name="${tagName}"> ` +
            `does not have a "class extends HTMLElement {}" in its script.`);
      }
      // TODO: don't use eval!!!
      window.customElements.define(tagName, eval(script.text));
    }

    // Set up element's shadow dom if added to the DOM after page load.
    const observer = new MutationObserver(mutations => {
      mutations.filter(m => m.type === 'childList').map(m => {
        Array.from(m.addedNodes)
          .filter(el => el.localName === tagName)
          .forEach(el => this._addDOM(el));
      });
    });
    observer.observe(document.body, {childList: true});
  }

  _addDOM(el) {
    const firstChild = this.firstElementChild;
    const usesShadowDOM = firstChild.localName === ShadowRootElement.is;
    if (usesShadowDOM) {
      firstChild.addShadowRootTo(el);
    } else if (firstChild.localName === 'template') {
      el.appendChild(document.importNode(firstChild.content, true));
    } else {
      throw Error(`First child of <${DefineCustomElementElement.is}> ` +
                  `should be a <template> or <${ShadowRootElement.is}>.`);
    }
  }
}

customElements.define(ShadowRootElement.is, ShadowRootElement);
customElements.define(DefineCustomElementElement.is, DefineCustomElementElement);
