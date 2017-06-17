import {
  // main reducer
  boldrReducer,
  selectBoldr,
  // menu
  menuReducer,
  selectMenus,
  selectMainMenu,
  makeSelectMainMenu,
  updateMenuDetails,
  addMenuDetail,
  // settings
  settingsReducer,
  selectSettings,
  selectSettingFromList,
  fetchSettingsIfNeeded,
  fetchSettings,
  updateBoldrSettings,
  arrayOfSetting,
  setting,
  // ui
  uiReducer,
  makeSelectUi,
  changeLayout,
  showModal,
  hideModal,
  setMobileDevice,
  makeSelectMobile,
  toggleDrawer,
  showHideSidebar,
  expandCollapseSideMenu,
  layoutSelector,
} from './boldr';

import {
  usersReducer,
  selectMe,
  forgotPassword,
  resetPassword,
  verifyAccount,
  editProfile,
  selectUsers,
  selectProfile,
  makeSelectCurrentProfile,
  makeSelectUser,
} from './users';
import {
  notificationReducer,
  sendNotification,
  dismissNotification,
  clearNotification,
} from './notifications';

export {
  // boldr
  boldrReducer,
  selectBoldr,
  // menu
  menuReducer,
  selectMenus,
  selectMainMenu,
  makeSelectMainMenu,
  fetchMainMenu,
  fetchMainMenuIfNeeded,
  updateMenuDetails,
  addMenuDetail,
  // settings
  settingsReducer,
  selectSettings,
  selectSettingFromList,
  updateBoldrSettings,
  arrayOfSetting,
  setting,
  // ui
  uiReducer,
  showHideSidebar,
  expandCollapseSideMenu,
  makeSelectUi,
  changeLayout,
  showModal,
  hideModal,
  setMobileDevice,
  makeSelectMobile,
  toggleDrawer,
  layoutSelector,
  // users
  usersReducer,
  selectMe,
  forgotPassword,
  resetPassword,
  verifyAccount,
  editProfile,
  selectUsers,
  selectProfile,
  makeSelectCurrentProfile,
  makeSelectUser,
  // notifications
  notificationReducer,
  sendNotification,
  dismissNotification,
  clearNotification,
};
