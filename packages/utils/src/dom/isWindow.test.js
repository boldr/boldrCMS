/**
 * @jest-environment jsdom
 */

import isWindow from './isWindow';

test('should be defined', () => {
  expect(isWindow).toBeDefined();
});
