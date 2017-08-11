/* @flow weak */
export default class ModalHandler {
  callBacks = [];
  suggestionCallback = undefined;
  editorFlag: boolean = false;
  suggestionFlag: boolean = false;

  closeAllModals = (event: Event) => {
    this.callBacks.forEach(callBack => {
      callBack(event);
    });
  };

  init = (wrapperId: string) => {
    const wrapper = document.getElementById(wrapperId); // eslint-disable-line no-undef
    wrapper.addEventListener('click', () => {
      this.editorFlag = true;
    });
    document.addEventListener('click', () => {
      // eslint-disable-line no-undef
      if (!this.editorFlag) {
        this.closeAllModals();
        if (this.suggestionCallback) {
          this.suggestionCallback();
        }
      } else {
        this.editorFlag = false;
      }
    });
    document.addEventListener('keydown', event => {
      // eslint-disable-line no-undef
      if (event.key === 'Escape') {
        this.closeAllModals();
      }
    });
  };

  handleEditorClick = () => {
    this.closeModals();
    if (!this.suggestionFlag && this.suggestionCallback) {
      this.suggestionCallback();
    } else {
      this.suggestionFlag = false;
    }
  };

  closeModals = (event: Object): void => {
    this.closeAllModals(event);
  };

  registerCallBack = (callBack: Function): void => {
    this.callBacks.push(callBack);
  };

  deregisterCallBack = (callBack: Function): void => {
    this.callBacks = this.callBacks.filter(cb => cb !== callBack);
  };

  setSuggestionCallback = (callBack: Function): void => {
    this.suggestionCallback = callBack;
  };

  removeSuggestionCallback = (): void => {
    this.suggestionCallback = undefined;
  };

  onSuggestionClick = (): void => {
    this.suggestionFlag = true;
  };
}
