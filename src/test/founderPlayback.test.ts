import { FounderPlayback } from '../features/founder/domain/FounderPlayback';
const blocks = [
  { id: 'intro', y: 0, height: 300, words: 10 },
  { id: 'end', y: 800, height: 250, words: 10 },
];
function run(player: FounderPlayback, start: number, duration: number) {
  for (let now = start; now <= start + duration; now += 16) player.tick(now);
}
it('waits for real measurements and finishes once only after the last reading pause', () => {
  const finish = jest.fn();
  const scroll = jest.fn();
  const player = new FounderPlayback(scroll, finish);
  player.resume();
  run(player, 0, 10000);
  expect(finish).not.toHaveBeenCalled();
  player.measure(blocks, 500, 1100);
  player.resume();
  run(player, 10000, 5500);
  expect(finish).not.toHaveBeenCalled();
  run(player, 15520, 40000);
  expect(finish).toHaveBeenCalledTimes(1);
  expect(player.offset).toBe(600);
  player.skip();
  player.tick(100000);
  expect(finish).toHaveBeenCalledTimes(1);
  expect(scroll.mock.calls.every(([y]) => y >= 0 && y <= 600)).toBe(true);
});
it('pauses without consuming background time and resumes without jumping', () => {
  const player = new FounderPlayback(jest.fn(), jest.fn());
  player.measure(blocks, 500, 1100);
  player.resume();
  run(player, 0, 8000);
  player.pause();
  const before = player.offset;
  run(player, 100000, 5000);
  expect(player.offset).toBe(before);
  player.resume();
  player.tick(200000);
  expect(player.offset).toBe(before);
  player.tick(200016);
  expect(player.offset - before).toBeLessThan(1);
});
it('uses actual tall-block height, reading time and an ending hold before completion', () => {
  const finish = jest.fn();
  const player = new FounderPlayback(jest.fn(), finish);
  player.measure([{ id: 'long', y: 0, height: 1200, words: 10 }], 400, 1200);
  player.resume();
  run(player, 0, 6000);
  expect(finish).not.toHaveBeenCalled();
  expect(player.offset).toBeGreaterThan(0);
  run(player, 6016, 35000);
  expect(finish).toHaveBeenCalledTimes(1);
  expect(player.offset).toBe(800);
});
it('preserves progress when remeasuring, supports manual positioning and replay', () => {
  const scroll = jest.fn();
  const player = new FounderPlayback(scroll, jest.fn());
  player.measure(blocks, 500, 1100);
  player.resume();
  run(player, 0, 8000);
  const index = player.index;
  player.measure(blocks, 450, 1100);
  expect(player.index).toBe(index);
  player.pause();
  player.manualOffset(600);
  expect(player.offset).toBe(600);
  expect(player.index).toBe(1);
  player.replay();
  expect(player.index).toBe(0);
  expect(player.offset).toBe(0);
  expect(scroll).toHaveBeenLastCalledWith(0);
});
it('reports scroll failures to its host and keeps skip available', () => {
  const finish = jest.fn();
  const player = new FounderPlayback(() => {
    throw new Error('Scroll unavailable');
  }, finish);
  player.measure([{ id: 'end', y: 800, height: 100, words: 10 }], 500, 1000);
  player.resume();
  player.tick(0);
  expect(() => player.tick(16)).toThrow('Scroll unavailable');
  player.pause();
  player.skip();
  expect(finish).toHaveBeenCalledTimes(1);
});
