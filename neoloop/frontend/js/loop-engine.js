// ===== NEOLOOP LOOP ENGINE =====
class LoopEngine {
  constructor(totalLoops, onLoopChange) {
    this.totalLoops = totalLoops || 5;
    this.currentLoop = 1;
    this.onLoopChange = onLoopChange;
    this.startTime = Date.now();
    this.loopStartTime = Date.now();
    this.memoryLog = []; // What player knows across loops

    this.loopVariations = {
      1: { light: 0xffffff, fogDensity: 0.02, ambientInt: 0.4, newObjects: [], hint: 'The room feels normal. Start exploring.' },
      2: { light: 0xccddff, fogDensity: 0.025, ambientInt: 0.35, newObjects: ['note_on_desk'], hint: 'Something changed. The desk has a new note.' },
      3: { light: 0xffeecc, fogDensity: 0.03, ambientInt: 0.3, newObjects: ['drawer_key', 'changed_note'], hint: 'The note means something different now. The drawer is unlocked.' },
      4: { light: 0xffccaa, fogDensity: 0.04, ambientInt: 0.25, newObjects: ['hidden_message'], hint: 'Loop 4. Time is distorting. New markings on the wall.' },
      5: { light: 0xff9999, fogDensity: 0.05, ambientInt: 0.2, newObjects: ['escape_key'], hint: 'FINAL LOOP. Everything you need is here. Find the exit NOW.' },
    };
  }

  getCurrentVariation() {
    const loop = Math.min(this.currentLoop, 5);
    return this.loopVariations[loop] || this.loopVariations[5];
  }

  recordMemory(event) {
    this.memoryLog.push({ loop: this.currentLoop, time: Date.now() - this.loopStartTime, event });
  }

  getMemoryForLoop(loopNum) {
    return this.memoryLog.filter(m => m.loop === loopNum);
  }

  getElapsedTime() {
    const ms = Date.now() - this.startTime;
    const total = Math.floor(ms / 1000);
    const m = String(Math.floor(total / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  getLoopElapsed() {
    return Math.floor((Date.now() - this.loopStartTime) / 1000);
  }

  triggerNextLoop(onComplete) {
    if (this.currentLoop >= this.totalLoops) {
      // Final loop — game over / forced escape
      if (onComplete) onComplete(false);
      return;
    }

    this.currentLoop++;
    this.loopStartTime = Date.now();
    const variation = this.getCurrentVariation();
    this.recordMemory(`Loop ${this.currentLoop} started`);

    if (this.onLoopChange) {
      this.onLoopChange(this.currentLoop, variation);
    }

    if (onComplete) {
      setTimeout(() => onComplete(true, variation), 2500);
    }
  }

  isLastLoop() { return this.currentLoop >= this.totalLoops; }

  getObjectsForCurrentLoop(baseObjects) {
    const variation = this.getCurrentVariation();
    const addedIds = new Set(variation.newObjects);
    return baseObjects.map(obj => ({
      ...obj,
      visible: obj.loopAppear ? obj.loopAppear <= this.currentLoop : true,
      glowing: addedIds.has(obj.id) || obj.glowing,
      modified: variation.newObjects.includes(obj.id),
    }));
  }

  getSummary() {
    return {
      totalTime: this.getElapsedTime(),
      loopsUsed: this.currentLoop,
      memoriesRecorded: this.memoryLog.length,
    };
  }
}

window.LoopEngine = LoopEngine;
