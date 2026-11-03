export interface StoryBlock {
  id: string;
  y: number;
  height: number;
  words: number;
}
export type PlaybackStatus = 'preparing' | 'playing' | 'paused' | 'finished';
/** Layout-driven playback clock. Owns no timers; its host supplies animation frames. */
export class FounderPlayback {
  status: PlaybackStatus = 'preparing';
  offset = 0;
  index = 0;
  private blocks: StoryBlock[] = [];
  private maximum = 0;
  private viewport = 0;
  private hold = 0;
  private tailHold = 0;
  private last: number | null = null;
  private completed = false;
  constructor(
    private scroll: (y: number) => void,
    private finish: () => void,
  ) {}
  measure(blocks: StoryBlock[], viewport: number, contentHeight: number) {
    if (viewport <= 0 || !blocks.length || contentHeight <= 0) return;
    this.blocks = [...blocks].sort((a, b) => a.y - b.y);
    this.viewport = viewport;
    this.maximum = Math.max(0, contentHeight - viewport);
    this.offset = Math.min(this.offset, this.maximum);
    this.index = Math.min(this.index, blocks.length - 1);
    if (this.status === 'preparing') this.status = 'paused';
    this.last = null;
  }
  resume() {
    if (this.status === 'paused' && !this.completed) {
      this.status = 'playing';
      this.last = null;
    }
  }
  pause() {
    if (this.status === 'playing') this.status = 'paused';
    this.last = null;
  }
  manualOffset(y: number) {
    if (this.status === 'playing' || !Number.isFinite(y)) return;
    this.offset = Math.max(0, Math.min(y, this.maximum));
    const visible = this.blocks.findIndex(
      block => block.y + block.height > this.offset + 20,
    );
    if (visible >= 0 && visible !== this.index) {
      this.index = visible;
      this.hold = 0;
      this.tailHold = 0;
    }
  }
  replay() {
    if (this.completed) return;
    this.index = 0;
    this.hold = 0;
    this.tailHold = 0;
    this.offset = 0;
    this.last = null;
    this.status = this.blocks.length ? 'paused' : 'preparing';
    this.scroll(0);
  }
  skip() {
    if (this.completed) return;
    this.completed = true;
    this.status = 'finished';
    this.finish();
  }
  tick(now: number) {
    if (this.status !== 'playing' || !this.blocks.length) return;
    if (this.last === null) {
      this.last = now;
      return;
    }
    // Background time or a delayed frame never becomes a large scroll jump.
    const elapsed = Math.max(0, Math.min(64, now - this.last));
    this.last = now;
    const block = this.blocks[this.index]!;
    const target = Math.min(this.maximum, Math.max(0, block.y - 20));
    const end = Math.min(
      this.maximum,
      Math.max(target, block.y + block.height - this.viewport + 32),
    );
    if (this.offset < target) {
      this.offset = Math.min(target, this.offset + elapsed * 0.032);
      this.scroll(this.offset);
      return;
    }
    // Read the beginning, then gently traverse any block taller than the viewport.
    const readingTime = Math.max(5500, block.words * 320);
    if (this.hold < readingTime) {
      this.hold += elapsed;
      return;
    }
    if (this.offset < end) {
      this.offset = Math.min(end, this.offset + elapsed * 0.026);
      this.scroll(this.offset);
      return;
    }
    if (end > target && this.tailHold < 3500) {
      this.tailHold += elapsed;
      return;
    }
    if (this.index === this.blocks.length - 1) {
      this.skip();
      return;
    }
    this.index++;
    this.hold = 0;
    this.tailHold = 0;
  }
  get progress() {
    return this.completed
      ? 1
      : (this.index +
          Math.min(
            0.9,
            this.hold /
              Math.max(5500, (this.blocks[this.index]?.words ?? 0) * 320),
          )) /
          Math.max(1, this.blocks.length);
  }
}
