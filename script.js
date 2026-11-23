
const responseBox = document.getElementById("response");
const micBtn = document.getElementById("micBtn");
const stopBtn = document.getElementById("stopBtn");
const sendBtn = document.getElementById("sendBtn");
const commandInput = document.getElementById("command");
const language = document.getElementById("language");
const statusBox = document.getElementById("status");

function speak(text) {
  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = language.value;
  speech.rate = 0.95;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

function reply(text) {
  responseBox.textContent = text;
  speak(text);
}

function processCommand(text) {
  const msg = text.toLowerCase().trim();

  if (!msg) return;

  if (
    msg.includes("hello") ||
    msg.includes("નમસ્તે") ||
    msg.includes("નમસ્કાર") ||
    msg.includes("નમસ્તે")
  ) {
    reply("Hello Sir, I am your personal assistant.");
  }

  else if (
    msg.includes("તમારું નામ") ||
    msg.includes("your name") ||
    msg.includes("तुम्हारा नाम")
  ) {
    reply("My name is Jarvis. Your personal AI assistant.");
  }

  else if (
    msg.includes("સમય") ||
    msg.includes("time")
  ) {
    reply("The current time is " +
      new Date().toLocaleTimeString());
  }

  else if (
    msg.includes("તારીખ") ||
    msg.includes("date")
  ) {
    reply("Today's date is " +
      new Date().toLocaleDateString());
  }

  else if (
    msg.includes("stop") ||
    msg.includes("બંધ")
  ) {
    window.speechSynthesis.cancel();
    responseBox.textContent = "I am ready, Sir.";
  }

  else {
    reply("I am listening, Sir. AI Brain will be connected in the next phase.");
  }
}

sendBtn.addEventListener("click", () => {
  processCommand(commandInput.value);
  commandInput.value = "";
});

commandInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    statusBox.textContent = "LISTENING...";
  };

  recognition.onend = () => {
    statusBox.textContent = "SYSTEM ONLINE";
  };

  recognition.onresult = (event) => {
    const text =
      event.results[0][0].transcript;

    responseBox.textContent = "You: " + text;
    processCommand(text);
  };

  recognition.onerror = (event) => {
    statusBox.textContent = "VOICE ERROR";
    responseBox.textContent =
      "Microphone error: " + event.error;
  };

  micBtn.addEventListener("click", () => {
    recognition.lang = language.value;

    try {
      recognition.start();
    } catch (error) {
      responseBox.textContent =
        "Please wait and try again.";
    }
  });

} else {
  micBtn.addEventListener("click", () => {
    responseBox.textContent =
      "Voice recognition is not supported in this browser.";
  });
}

stopBtn.addEventListener("click", () => {
  if (recognition) recognition.stop();

  window.speechSynthesis.cancel();

  statusBox.textContent = "SYSTEM ONLINE";
  responseBox.textContent = "Voice stopped, Sir.";
});
