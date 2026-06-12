// ===== NEOLOOP PUZZLE ENGINE =====
class PuzzleEngine {
  constructor(roomType, difficulty, loopEngine) {
    this.roomType = roomType;
    this.difficulty = difficulty;
    this.loopEngine = loopEngine;
    this.solved = new Set();
    this.keyFragments = 0;
    this.requiredKeys = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
    this.puzzles = this.generatePuzzles();
  }

  generatePuzzles() {
    const base = {
      bedroom: [
        { id: 'mirror_code', type: 'number', title: 'Mirror Code', icon: '🪞', desc: 'The mirror shows reversed numbers. What is the correct sequence?', answer: '7341', loop: 1, clue: 'Look at the mirror — numbers appear reversed.' },
        { id: 'book_order', type: 'sequence', title: 'Bookshelf Pattern', icon: '📚', desc: 'Arrange the books by color in the correct order based on the lamp flickers.', answer: ['📘','📗','📙','📕'], loop: 2, clue: 'The lamp flickered 4 times before you touched the books.' },
        { id: 'drawer_key', type: 'key', title: 'Hidden Drawer Key', icon: '🗝️', desc: 'A key fragment is hidden in the drawer. Found in Loop 3.', answer: null, loop: 3, clue: 'The drawer was empty before. Check it now.' },
        { id: 'wardrobe_lock', type: 'number', title: 'Wardrobe Combination', icon: '🗄️', desc: 'The wardrobe has a 4-digit lock. The code changed in Loop 4.', answer: '2891', loop: 4, clue: 'Loop 2 note said "my birth year reversed".' },
      ],
      office: [
        { id: 'clock_hands', type: 'number', title: 'Clock Code', icon: '🕐', desc: 'The clock hands point to numbers. Read them clockwise.', answer: '3927', loop: 1, clue: 'The wall clock hands point at 3, 9, 2, 7.' },
        { id: 'whiteboard_cipher', type: 'number', title: 'Whiteboard Cipher', icon: '📋', desc: 'Decode the symbols on the whiteboard. Each symbol = a digit.', answer: '5514', loop: 2, clue: 'Triangle=5, Circle=5, Square=1, Star=4.' },
        { id: 'cabinet_key', type: 'key', title: 'Filing Cabinet Key', icon: '🗂️', desc: 'A key fragment is inside the filing cabinet. Loop 3 unlocks it.', answer: null, loop: 3, clue: 'The cabinet lock changed combination this loop.' },
        { id: 'printer_code', type: 'sequence', title: 'Printer Output', icon: '🖨️', desc: 'Arrange the printed pages in correct order to reveal the escape code.', answer: ['1','3','2','4'], loop: 4, clue: 'Pages numbered by importance, not print order.' },
      ],
      lab: [
        { id: 'tube_colors', type: 'sequence', title: 'Tube Color Sequence', icon: '🧪', desc: 'Arrange test tubes by spectral frequency — ROYGBIV order.', answer: ['🔴','🟠','🟡','🟢','🔵'], loop: 1, clue: 'Light spectrum: Red first, Violet last.' },
        { id: 'notebook_code', type: 'number', title: 'Lab Notebook Entry', icon: '📓', desc: 'The notebook entry changes each loop. Read the loop-3 formula result.', answer: '8472', loop: 2, clue: 'Formula result in loop 3 notebook: 8472.' },
        { id: 'flask_key', type: 'key', title: 'Glowing Flask Key', icon: '⚗️', desc: 'The flask glows in loop 5, revealing a key fragment inside.', answer: null, loop: 3, clue: 'UV light makes the key visible through the glass.' },
        { id: 'terminal_pin', type: 'number', title: 'Terminal PIN', icon: '💻', desc: 'The terminal requires a 4-digit PIN. Derived from tube experiment results.', answer: '3141', loop: 4, clue: 'The experiment result was Pi × 1000, truncated.' },
      ],
    };

    const roomPuzzles = base[this.roomType] || base.bedroom;
    if (this.difficulty === 'easy') return roomPuzzles.slice(0, 2);
    if (this.difficulty === 'hard') return roomPuzzles;
    return roomPuzzles.slice(0, 3);
  }

  getPuzzlesForLoop(loopNum) {
    return this.puzzles.filter(p => p.loop <= loopNum && !this.solved.has(p.id));
  }

  solvePuzzle(puzzleId) {
    if (!this.solved.has(puzzleId)) {
      this.solved.add(puzzleId);
      const puzzle = this.puzzles.find(p => p.id === puzzleId);
      if (puzzle && puzzle.type === 'key') {
        this.keyFragments++;
      }
      return true;
    }
    return false;
  }

  isEscapeable() {
    return this.keyFragments >= this.requiredKeys ||
      (this.loopEngine && this.loopEngine.currentLoop >= this.loopEngine.totalLoops);
  }

  getHint(loopNum) {
    const available = this.getPuzzlesForLoop(loopNum);
    if (available.length === 0) return 'All available puzzles solved. Find the exit!';
    const puzzle = available[Math.floor(Math.random() * available.length)];
    return puzzle.clue || 'Keep exploring...';
  }
}

window.PuzzleEngine = PuzzleEngine;
