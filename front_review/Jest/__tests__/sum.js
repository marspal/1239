const sum = require("../sum");

test("adds 1 + 2 to rqual 3", () => {
  expect(sum(1,2)).toBe(3);
  expect(2 + 2).not.toBe(5);
});

test("object assignment", () => {
  const data = {one: 1};
  data["two"] = 2;
  expect(data).toEqual({one: 1, two: 2});
});

test("to be true or false", () => {
  expect(1).toBeTruthy();
  expect(0).toBeFalsy();
});

test("test Number", () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeLessThan(5);
  expect(value).toBe(4);
  expect(value).toEqual(4)
});
test('adding floating point numbers', () => {
  const value = 0.1 + 0.2;
  // expect(value).toBe(0.3);             This won't work because of rounding error
  expect(value).toBeCloseTo(0.3); // This works.
});

test("this is no I in team", () => {
  expect("team").not.toMatch(/I/);
});

test("but there is a 'stop' in Christoph", () => {
  expect("Christoph").toMatch(/stop/);
});

test("the shopping list has beer on it", () => {
  const shoppingList = [
    'diapers',
    'kleenex',
    'trash bags',
    'paper towels',
    'beer',
  ];
  expect(shoppingList).toContain('beer');
  expect(new Set(shoppingList)).toContain('beer');
});

function forEach(items, callback){
  for(let index = 0; index < items.length; ++index){
    callback(items[index]);
  }
}

it("testing forEach", () => {
  const mockCallback = jest.fn((x)=>42+x);
  forEach([0,1], mockCallback);
  expect(mockCallback.mock.calls.length).toBe(2);
  expect(mockCallback.mock.calls[0][0]).toBe(0);
  
  // The first argument of the second call to the function was 1
  expect(mockCallback.mock.calls[1][0]).toBe(1);

  // The return value of the first call to the function was 42
  expect(mockCallback.mock.results[0].value).toBe(42);
});

