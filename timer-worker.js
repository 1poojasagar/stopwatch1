let intervalId;

self.addEventListener('message', function (event) {
   // Event listener for receiving messages from the main script
  // The event object contains the received message
  if (event.data === 'start') {
    intervalId = setInterval(function () {//The setInterval() method calls a function at specified intervals (in milliseconds).
      self.postMessage('tick');//The self.postMessage method is used to send a message back to the main script. In this case, it is sending a message with the content 'tick' to indicate that a tick of the timer has occurred.
    }, 10);
  } else if (event.data === 'stop') {//The event.data property contains the optional data passed to an event method when the current executing handler is bound.
   // Stop the timer logic
    clearInterval(intervalId);//The clearInterval() method clears a timer set with the setInterval() method.
  }
});