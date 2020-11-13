test('testing 2 === 2 to make sure jest works', () => {
  expect(2).toBe(2);
})

import Vector from "./static/modules/vectors.js";

const v1 = new Vector(1,2);
const v2 = new Vector(0,0);

test('adding two vectors', () => {
  const v3 = v1.plus(v2);
  expect(v3.x).toBe(1);
  expect(v3.y).toBe(2);
})
