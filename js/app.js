import { notes, scales } from "./data.js";
import { Fretboard } from "./fretboard.js";
import { Metronome } from "./audio.js";

const state = {
  keyIndex: 0,
  scaleId: "major",
  shapeMode: "triad",
  showConnectors: false,
};

const storageKeys = {
  keyIndex: "groove.keyIndex",
  scaleId: "groove.scaleId",
};

const elements = {
  offlineWarning: document.getElementById("offlineWarning"),
  keySelect: document.getElementById("keySelect"),
  scaleSelect: document.getElementById("scaleSelect"),
  btnTriad: document.getElementById("btnTriad"),
  btnTetrad: document.getElementById("btnTetrad"),
  btnConnectors: document.getElementById("btnConnectors"),
  nnsGrid: document.getElementById("nnsGrid"),
  fretboard: document.getElementById("fretboard"),
  fretNumbers: document.getElementById("fretNumbers"),
  progressionText: document.getElementById("progressionText"),
  bpmDisplay: document.getElementById("bpmDisplay"),
  btnChallenge: document.getElementById("btnChallenge"),
  metronomeToggle: document.getElementById("metronomeToggle"),
  bpmSlider: document.getElementById("bpmSlider"),
  bpmValue: document.getElementById("bpmValue"),
};

const fretboard = new Fretboard({
  boardEl: elements.fretboard,
  numbersEl: elements.fretNumbers,
});

const metronome = new Metronome({
  bpm: Number(elements.bpmSlider.value),
  onTick: () => {
    elements.metronomeToggle.classList.add("active");
    setTimeout(() => elements.metronomeToggle.classList.remove("active"), 100);
  },
});

const randomDegrees = ["1", "2", "3", "4", "5", "6", "1/3", "5/7"];

const getScaleConfig = () => scales.find((scale) => scale.id === state.scaleId);

const persistState = () => {
  try {
    localStorage.setItem(storageKeys.keyIndex, String(state.keyIndex));
    localStorage.setItem(storageKeys.scaleId, state.scaleId);
  } catch (error) {
    console.warn("Persistência indisponível:", error);
  }
};

const restoreState = () => {
  try {
    const storedKey = localStorage.getItem(storageKeys.keyIndex);
    const storedScale = localStorage.getItem(storageKeys.scaleId);

    if (storedKey !== null) {
      state.keyIndex = Number(storedKey);
    }
    if (storedScale && scales.some((scale) => scale.id === storedScale)) {
      state.scaleId = storedScale;
    }
  } catch (error) {
    console.warn("Persistência indisponível:", error);
  }
};

const initSelects = () => {
  notes.forEach((note, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = note;
    elements.keySelect.appendChild(option);
  });

  scales.forEach((scale) => {
    const option = document.createElement("option");
    option.value = scale.id;
    option.textContent = scale.label;
    elements.scaleSelect.appendChild(option);
  });

  elements.keySelect.value = String(state.keyIndex);
  elements.scaleSelect.value = state.scaleId;
};

const updateNNS = () => {
  const scale = getScaleConfig();
  elements.nnsGrid.innerHTML = "";

  scale.intervals.forEach((interval, index) => {
    const noteIndex = (state.keyIndex + interval) % 12;
    const item = document.createElement("div");
    item.className = "nns-item";
    item.dataset.noteIndex = String(noteIndex);
    item.dataset.degree = scale.degrees[index];

    item.innerHTML = `
      <div class="nns-degree">${scale.degrees[index]}</div>
      <div class="nns-note">${notes[noteIndex]}</div>
    `;

    item.addEventListener("mouseenter", () => {
      fretboard.clearHighlights();
      fretboard.highlightNote(noteIndex);
    });

    item.addEventListener("mouseleave", () => {
      fretboard.clearHighlights();
    });

    elements.nnsGrid.appendChild(item);
  });
};

const updateFretboardMarkers = () => {
  const scale = getScaleConfig();
  const scaleNotes = scale.intervals.map(
    (interval) => (state.keyIndex + interval) % 12
  );
  const chordDegrees =
    state.shapeMode === "triad" ? scale.triad : scale.tetrad;

  fretboard.updateMarkers({
    scaleNotes,
    chordDegrees,
    showConnectors: state.showConnectors,
  });
};

const updateControls = () => {
  elements.btnTriad.classList.toggle("active", state.shapeMode === "triad");
  elements.btnTetrad.classList.toggle("active", state.shapeMode === "tetrad");
  elements.btnConnectors.classList.toggle("active", state.showConnectors);
};

const updateDashboard = () => {
  updateControls();
  updateNNS();
  updateFretboardMarkers();
  persistState();
};

const generateChallenge = () => {
  const progression = Array.from({ length: 4 }, () => {
    const index = Math.floor(Math.random() * randomDegrees.length);
    return randomDegrees[index];
  });
  const bpm = Math.floor(Math.random() * 61) + 60;

  elements.progressionText.textContent = progression.join(" - ");
  elements.bpmDisplay.textContent = String(bpm);
};

const initEvents = () => {
  elements.keySelect.addEventListener("change", (event) => {
    state.keyIndex = Number(event.target.value);
    updateDashboard();
  });

  elements.scaleSelect.addEventListener("change", (event) => {
    state.scaleId = event.target.value;
    updateDashboard();
  });

  elements.btnTriad.addEventListener("click", () => {
    state.shapeMode = "triad";
    updateDashboard();
  });

  elements.btnTetrad.addEventListener("click", () => {
    state.shapeMode = "tetrad";
    updateDashboard();
  });

  elements.btnConnectors.addEventListener("click", () => {
    state.showConnectors = !state.showConnectors;
    updateDashboard();
  });

  elements.btnChallenge.addEventListener("click", generateChallenge);

  elements.bpmSlider.addEventListener("input", (event) => {
    const value = Number(event.target.value);
    elements.bpmValue.textContent = String(value);
    metronome.setBpm(value);
  });

  elements.metronomeToggle.addEventListener("click", () => {
    const playing = metronome.toggle();
    elements.metronomeToggle.textContent = playing ? "Stop" : "Play";
  });
};

const init = () => {
  if (elements.offlineWarning) {
    elements.offlineWarning.hidden = true;
  }
  restoreState();
  initSelects();
  fretboard.renderStructure();
  updateDashboard();
  initEvents();
};

init();
