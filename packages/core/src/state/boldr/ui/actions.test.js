import * as t from '../actionTypes';
import {
  showModal,
  hideModal,
  setMobileDevice,
  changeLayout,
  toggleSidebar,
  toggleCollapse,
  hideHeader,
  showHeader,
} from './actions';

describe('UI Actions', () => {
  test('showModal -- should return the correct type', () => {
    const expectedResult = {
      type: t.MODAL_OPEN,
    };

    expect(showModal()).toEqual(expectedResult);
  });
  test('hideModal -- should return the correct type', () => {
    const expectedResult = {
      type: t.MODAL_CLOSED,
    };

    expect(hideModal()).toEqual(expectedResult);
  });

  test('setMobileDevice -- should return the correct type', () => {
    const expectedResult = {
      type: t.SET_MOBILE_DEVICE,
      payload: true,
    };

    expect(setMobileDevice()).toEqual(expectedResult);
  });
  test('toggleSidebar -- should return the correct type', () => {
    const expectedResult = {
      type: t.TOGGLE_SIDEBAR,
      payload: undefined,
    };

    expect(toggleSidebar()).toEqual(expectedResult);
  });
  test('showHeader -- should return the correct type', () => {
    const expectedResult = {
      type: t.SHOW_HEADER,
      payload: undefined,
    };

    expect(showHeader()).toEqual(expectedResult);
  });
  test('hideHeader -- should return the correct type', () => {
    const expectedResult = {
      type: t.HIDE_HEADER,
      payload: undefined,
    };

    expect(hideHeader()).toEqual(expectedResult);
  });
  test('toggleCollapse -- should return the correct type', () => {
    const expectedResult = {
      type: t.TOGGLE_COLLAPSE,
      payload: undefined,
    };

    expect(toggleCollapse()).toEqual(expectedResult);
  });
  test('changeLayout -- should return the correct type', () => {
    const expectedResult = {
      type: t.CHANGE_LAYOUT,
      payload: undefined,
    };

    expect(changeLayout()).toEqual(expectedResult);
  });
});