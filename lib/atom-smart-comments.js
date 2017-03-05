'use babel';

import {shell} from 'electron'

export default {
  activate() {
    document.body.addEventListener('click', this.linkClick);
  },

  deactivate() {
    document.body.removeEventListener('click', this.linkClick);
  },

  linkClick(e) {
    // TODO: We could do the validation using cursor.getScopeDescriptor()
    // The scopes are less likely to change than the css classes
    if (e.target && e.target.classList.contains('syntax--hyperlink') &&
        e.target.parentNode && e.target.parentNode.classList.contains('syntax--comment')) {
      const editor = atom.workspace.getActiveTextEditor();
      const cursor = editor.getCursors()[0];
      const pos = cursor.getBufferPosition();
      const url = e.target.textContent;

      const previousWord = editor.getTextInBufferRange([
        pos.copy().translate([0, -url.length]),
        pos.copy()
      ]);

      const followingWord = editor.getTextInBufferRange([
        pos.copy(),
        pos.copy().translate([0, url.length])
      ]);

      if (previousWord !== url && followingWord !== url &&
          editor.getSelectedText().length === 0) {
        shell.openExternal(url);
      }
    }
  }
};
