let toggleBtn = document.getElementById('toggle');
let lapBtn = document.getElementById('lap');
let resetBtn = document.getElementById('reset');
let lapList = document.getElementById('lapList');

let hour = 0;
let minute = 0;
let second = 0;
let count = 0;
let timer = false;
let lapCount = 1;
let lapStartTime = 0;
let worker = null;
let resetClicked = false;

toggleBtn.addEventListener('click', function () {
  if (timer) {
    // Stop the stopwatch
    timer = false;
    toggleBtn.textContent = 'Start';
    lapBtn.style.display = 'none';
    resetBtn.style.display = 'inline';
    worker.postMessage('stop');
  } else {
    // Start the stopwatch
    if (resetClicked) {
      hour = 0;
      minute = 0;
      second = 0;
      count = 0;
      lapCount = 1;
      lapStartTime = Date.now(); // Store the lap start time
      resetClicked = false;
    }

    timer = true;
    lapStartTime = Date.now(); // Store the lap start time
    console.log(lapStartTime);
    toggleBtn.textContent = 'Stop';
    lapBtn.style.display = 'inline';
    resetBtn.style.display = 'none';

    if (!worker) {
      worker = new Worker('timer-worker.js');
      worker.addEventListener('message', function (event) {
        if (event.data === 'tick') {
          stopWatch();
        }
      });
    }

    worker.postMessage('start');
  }
});
resetBtn.addEventListener('click', function () {
  resetClicked = true;
  timer = false;
  toggleBtn.textContent = 'Start';
  lapBtn.style.display = 'inline';
  resetBtn.style.display = 'none';
  document.getElementById('hr').textContent = '00';
  document.getElementById('min').textContent = '00';
  document.getElementById('sec').textContent = '00';
  document.getElementById('count').textContent = '00';
  lapList.innerHTML = '';

  if (worker) {
    worker.terminate();
    worker = null;
  }
});

lapBtn.addEventListener('click', function () {
  if (timer) {
    
    let lapTime = getFormattedTime(Date.now() - lapStartTime); // Calculate lap time difference
    console.log(lapTime);
    console.log(lapStartTime);
    let lapItem = document.createElement('li');//The createElement() method creates an element node.
    lapItem.textContent = 'Lap ' + lapCount + ': ' + lapTime;
    lapList.appendChild(lapItem);//The appendChild() method appends a node (element) as the last child of an element.
    lapCount++;
    lapStartTime = Date.now(); // Update the lap start time
    console.log(lapTime);
  }
});

function stopWatch() {
  count++;

  if (count === 100) {
    second++;
    count = 0;
  }

  if (second === 60) {
    minute++;
    second = 0;
  }

  if (minute === 60) {
    hour++;
    minute = 0;
    second = 0;
  }

  let hrString = hour < 10 ? '0' + hour : hour;
  let minString = minute < 10 ? '0' + minute : minute;
  let secString = second < 10 ? '0' + second : second;
  let countString = count < 10 ? '0' + count : count;

  document.getElementById('hr').textContent = hrString;
  document.getElementById('min').textContent = minString;
  document.getElementById('sec').textContent = secString;
  document.getElementById('count').textContent = countString;
}

function getFormattedTime(timeDifference) {
  let milliseconds = Math.floor(timeDifference % 1000 / 10);
  let seconds = Math.floor(timeDifference / 1000) % 60;
  let minutes = Math.floor(timeDifference / 1000 / 60) % 60;
  let hours = Math.floor(timeDifference / 1000 / 60 / 60);

  let hrString = hours < 10 ? '0' + hours : hours;
  let minString = minutes < 10 ? '0' + minutes : minutes;
  let secString = seconds < 10 ? '0' + seconds : seconds;
  let countString = milliseconds < 10 ? '0' + milliseconds : milliseconds;

  return hrString + ':' + minString + ':' + secString + ':' + countString;
}