import { fretCount, stringTuning } from "./data.js";

export class Fretboard {
  constructor({ boardEl, numbersEl }) {
    this.boardEl = boardEl;
    this.numbersEl = numbersEl;
    this.markers = [];
  }

  renderStructure() {
    this.boardEl.innerHTML = "";
    this.numbersEl.innerHTML = "";
    this.markers = [];

    stringTuning.forEach((startNoteIndex, stringIdx) => {
      const stringDiv = document.createElement("div");
      stringDiv.className = "string";

      for (let fret = 0; fret <= fretCount; fret += 1) {
        const fretDiv = document.createElement("div");
        fretDiv.className = "fret";

        const marker = document.createElement("div");
        marker.className = "marker";
        marker.dataset.string = String(stringIdx);
        marker.dataset.fret = String(fret);
        marker.dataset.noteIndex = String((startNoteIndex + fret) % 12);

        fretDiv.appendChild(marker);
        stringDiv.appendChild(fretDiv);
        this.markers.push(marker);
      }

      this.boardEl.appendChild(stringDiv);
    });

    const spacer = document.createElement("div");
    spacer.style.width = "44px";
    this.numbersEl.appendChild(spacer);

    for (let fret = 1; fret <= fretCount; fret += 1) {
      const num = document.createElement("div");
      num.className = "fret-num";
      num.innerText = fret;
      if ([3, 5, 7, 9, 12].includes(fret)) num.style.color = "#fff";
      this.numbersEl.appendChild(num);
    }
  }

  updateMarkers({ scaleNotes, chordDegrees, showConnectors }) {
    this.markers.forEach((marker) => {
      const noteVal = Number(marker.dataset.noteIndex);
      marker.className = "marker";
      marker.innerText = "";

      const degreeIndex = scaleNotes.indexOf(noteVal);
      if (degreeIndex === -1) return;

      const chordIndex = chordDegrees.indexOf(degreeIndex);
      if (chordIndex !== -1) {
        const degreeClass = this.degreeClass(chordIndex);
        marker.classList.add("show", degreeClass);
        marker.innerText = this.degreeLabel(chordIndex);
        return;
      }

      if (showConnectors) {
        marker.classList.add("show", "scale");
      }
    });
  }

  degreeClass(chordIndex) {
    if (chordIndex === 0) return "root";
    if (chordIndex === 1) return "third";
    if (chordIndex === 2) return "fifth";
    return "seventh";
  }

  degreeLabel(chordIndex) {
    if (chordIndex === 0) return "R";
    if (chordIndex === 1) return "3";
    if (chordIndex === 2) return "5";
    return "7";
  }

  clearHighlights() {
    this.markers.forEach((marker) => marker.classList.remove("highlight"));
  }

  highlightNote(noteIndex) {
    this.markers.forEach((marker) => {
      if (Number(marker.dataset.noteIndex) === noteIndex) {
        marker.classList.add("highlight", "show");
      }
    });
  }
}
