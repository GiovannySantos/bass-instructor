export class Metronome {
  constructor({ bpm = 96, onTick } = {}) {
    this.audioContext = null;
    this.isPlaying = false;
    this.bpm = bpm;
    this.intervalId = null;
    this.onTick = onTick;
  }

  setBpm(value) {
    this.bpm = value;
    if (this.isPlaying) {
      this.stop();
      this.start();
    }
  }

  start() {
    if (this.isPlaying) return;
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    this.isPlaying = true;
    const interval = (60 / this.bpm) * 1000;

    this.intervalId = setInterval(() => {
      this.playClick();
      if (this.onTick) this.onTick();
    }, interval);
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  playClick() {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.frequency.value = 1000;
    gain.gain.value = 0.1;

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.05);
  }
}
