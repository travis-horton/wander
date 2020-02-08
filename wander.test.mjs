import Vector from './static/modules/vectors.mjs';

const v1 = new Vector(1,1);
const v2 = new Vector(1,1);

test('adding to vectors [1,1] and [1,1] yields [2,2]', () => {
  expect(v1.add(v2)).toEqual([2,2]);
});
