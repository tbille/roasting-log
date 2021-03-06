var clicked = false;
var timer = 0;
var intervalValue = 0;
var firstCrackTime, secondCrackTime;
var tableTrack = [["time", "setTemperature", "currentTemperature", "note"]];

function resetState() {
  resetClock();
  resetTable();
  document.getElementById("intervalTimer").disabled = false;
  document.getElementById("startRoast").disabled = false;
  document.getElementById("stopRoast").innerText = "End Roast";
  document.getElementById("stopRoast").disabled = true;
  document.getElementById("resetRoast").disabled = true;
  document.getElementById("exportToCSV").disabled = true;

  document.getElementById("firstCrack").classList.add("is-disabled");
  document
    .getElementById("firstCrack")
    .getElementsByTagName("i")[0]
    .classList.add("p-icon--plus");
  document
    .getElementById("firstCrack")
    .getElementsByTagName("i")[0]
    .classList.remove("p-icon--minus");
  document.getElementById("secondCrack").classList.add("is-disabled");
  document
    .getElementById("secondCrack")
    .getElementsByTagName("i")[0]
    .classList.add("p-icon--plus");
  document
    .getElementById("secondCrack")
    .getElementsByTagName("i")[0]
    .classList.remove("p-icon--minus");

  document.getElementById("developement").innerHTML = "--%";
  document.getElementById("firstCrackTime").innerHTML = "--:--";
  document.getElementById("secondCrackTime").innerHTML = "--:--";

  document.getElementById("setTemperature").disabled = true;
  document.getElementById("setTemperature").value = "";
  document.getElementById("currentTemperature").disabled = true;
  document.getElementById("currentTemperature").value = "";
  document.getElementById("notes").value = "";

  tableTrack = [["time", "setTemperature", "currentTemperature", "note"]];
  firstCrackTime = null;
  secondCrackTime = null;
}

// I run this function to avoid broswer button caching
resetState();

document.getElementById("startRoast").onclick = function () {
  startClock();
  document.getElementById("intervalTimer").disabled = true;
  document.getElementById("startRoast").disabled = true;
  document.getElementById("stopRoast").disabled = false;
  document.getElementById("resetRoast").disabled = true;

  document.getElementById("firstCrack").classList.remove("is-disabled");
  document.getElementById("secondCrack").classList.remove("is-disabled");
  document.getElementById("setTemperature").disabled = false;
  document.getElementById("currentTemperature").disabled = false;
};
document.getElementById("stopRoast").onclick = function () {
  if (clicked) {
    stopClock();
    document.getElementById("stopRoast").innerText = "Resume Roast";
    document.getElementById("startRoast").disabled = true;
    document.getElementById("stopRoast").disabled = false;
    document.getElementById("resetRoast").disabled = false;
    document.getElementById("exportToCSV").disabled = false;
  } else {
    startClock();
    document.getElementById("stopRoast").innerText = "End Roast";
    document.getElementById("resetRoast").disabled = true;
    document.getElementById("exportToCSV").disabled = true;
  }
};
document.getElementById("resetRoast").onclick = function () {
  var reset = confirm("Are you sure you want to reset the timer?");
  if (reset) {
    resetState();
  }
};
document.getElementById("exportToCSV").onclick = function () {
  let csvContent =
    "data:text/csv;charset=utf-8," +
    tableTrack.map((e) => e.join(",")).join("\n");

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "roast-logs.csv");
  document.body.appendChild(link); // Required for FF

  link.click();
};
document.getElementById("addRowForm").onsubmit = function (e) {
  e.preventDefault();

  var currentTime = timer;
  var setTemperature = document.getElementById("setTemperature").value;
  var currentTemperature = document.getElementById("currentTemperature")
    .value;
  var notes = document.getElementById("notes").value;

  if (
    !document.getElementById("firstCrack").classList.contains("is-disabled")
  ) {
    if (
      document
        .getElementById("firstCrack")
        .getElementsByTagName("i")[0]
        .classList.contains("p-icon--minus")
    ) {
      if (notes) {
        notes = "First crack - " + notes;
      } else {
        notes = "First crack";
      }
      updateTimer(currentTime, "firstCrackTime");
      firstCrackTime = currentTime;
      document.getElementById("firstCrack").classList.add("is-disabled");
    }
  }
  if (
    !document.getElementById("secondCrack").classList.contains("is-disabled")
  ) {
    if (
      document
        .getElementById("secondCrack")
        .getElementsByTagName("i")[0]
        .classList.contains("p-icon--minus")
    ) {
      if (notes) {
        notes = "Second crack - " + notes;
      } else {
        notes = "Second crack";
      }

      updateTimer(currentTime, "secondCrackTime");
      document.getElementById("secondCrack").classList.add("is-disabled");
    }
  }

  addRow(currentTime, setTemperature, currentTemperature, notes);

  document.getElementById("currentTemperature").value = "";
  document.getElementById("notes").value = "";
};
document.getElementById("firstCrack").onclick = function () {
  updateIcon("firstCrack");
};
document.getElementById("secondCrack").onclick = function () {
  updateIcon("secondCrack");
};

function updateIcon(id) {
  if (document.getElementById(id).classList.contains("is-disabled")) {
    return;
  }

  var icon = document.getElementById(id).getElementsByTagName("i")[0];
  if (icon.classList.contains("p-icon--plus")) {
    icon.classList.remove("p-icon--plus");
    icon.classList.add("p-icon--minus");
  } else {
    icon.classList.remove("p-icon--minus");
    icon.classList.add("p-icon--plus");
  }
}

function secondsToHuman(time) {
  var minutes = Math.floor(time / 60);
  var seconds = time - minutes * 60;

  function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  return str_pad_left(minutes, "0", 2) + ":" + str_pad_left(seconds, "0", 2);
}

function updateTimer(currentTimer, timerName) {
  document.getElementById(timerName).innerHTML = secondsToHuman(currentTimer);
}

function startClock() {
  if (clicked === false) {
    intervalValue = document.getElementById("intervalTimer").value;
    if (isNaN(intervalValue)) {
      // TODO error
    }
    clock = setInterval("incWatch()", 1000);
    clicked = true;
  }
}

function incWatch() {
  timer++;
  updateTimer(timer, "timer");

  if (firstCrackTime) {
    updateDevelopement(firstCrackTime, timer);
  }

  if (timer % intervalValue === 0) {
    beep();
  }
}

function stopClock() {
  window.clearInterval(clock);
  clicked = false;

  setTemperature = document.getElementById("setTemperature").value;
  currentTemperature = document.getElementById("currentTemperature").value;
  notes = document.getElementById("notes").value;
  if (notes) {
    notes = "End Roast - " + notes;
  } else {
    notes = "End Roast";
  }

  addRow(timer, setTemperature, currentTemperature, notes);
}

function resetClock() {
  if (!clicked) {
    timer = 0;
    firstCrackTime = null;
    updateTimer(timer, "timer");
    updateDevelopement(firstCrackTime, timer);
  }
}

function updateDevelopement(fc, currentTime) {
  if (fc) {
    developement = 100 - (fc / currentTime) * 100;
    document.getElementById("developement").innerHTML =
      Math.round((developement + Number.EPSILON) * 100) / 100 + "%";
  } else {
    document.getElementById("developement").innerHTML = "--%";
  }
}

function addRow(currentTime, setTemperature, currentTemperature, note) {
  var table = document.getElementById("roastingRows");
  var row = table.insertRow(0);

  var timeCell = row.insertCell(0);
  var setTemperatureCell = row.insertCell(1);
  var currentTemperatureCell = row.insertCell(2);
  var noteCell = row.insertCell(3);

  humanTime = secondsToHuman(currentTime);
  timeCell.innerHTML = humanTime;
  if (setTemperature) {
    setTemperatureCell.innerHTML = setTemperature;
  }
  if (currentTemperature) {
    currentTemperatureCell.innerHTML = currentTemperature;
  }
  if (note) {
    noteCell.innerHTML = note;
  }

  tableTrack.push([humanTime, setTemperature, currentTemperature, note]);
}

function resetTable() {
  var new_tbody = document.createElement("tbody");
  new_tbody.id = "roastingRows";

  var old_tbody = document.getElementById("roastingRows");
  old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
}

// Source: https://stackoverflow.com/questions/879152/how-do-i-make-javascript-beep
function beep() {
  var snd = new Audio(
    "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
  );
  snd.play();
}