const switchMode = document.querySelector('button.mode-switch')
const body = document.querySelector('body')
const closeBtn = document.querySelector('.btn-close-right')
const rightSide = document.querySelector('.right-side')
const expandBtn = document.querySelector('.expand-btn');
const webcamElement = document.getElementById('webcam');
const canvas = document.getElementById('canvas'); 
const chat_box = document.getElementById("chat-area");
const btn_mic = document.getElementById("btn-mic")
const btn_camera = document.getElementById("btn-camera")
const txt_chat = document.getElementById("chat-input")
const btn_send_msg = document.getElementById("btn-send-msg")

const messages = [];
let myvad = null;

// Inint speaker
const speech = new SpeechSynthesisUtterance();
const speaker = window.speechSynthesis;
let assistant_name = "OliviB";
for (const voice of speaker.getVoices()) {
  console.log(voice.name)
  if (voice.name === "Samantha") {
    speech.voice = voice;
    console.log(">> Voice:", voice.name)
    break;
  }
}

// Event 
switchMode.addEventListener('click', () => {
  body.classList.toggle('dark');
});
closeBtn.addEventListener('click', () => {
  rightSide.classList.remove('show');
  expandBtn.classList.add('show');
});
expandBtn.addEventListener('click', () => {
  rightSide.classList.add('show');
  expandBtn.classList.remove('show');
});

txt_chat.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    btn_send_msg.click();
  }
});

speech.addEventListener("start", (event) => {
  console.log(
    `Start speak ... `,
  );
  pause_vad()
});
speech.addEventListener("end", (event) => {
  console.log(
    `Utterance has finished being spoken after ${event.elapsedTime} seconds.`,
  );
  resume_vad()
});
speech.addEventListener("error", (event) => {
  console.log(
    `Error on speak ... `,
  );
  resume_vad()
});

// Function

const update_setting = () => {
  axios.defaults.baseURL = document.getElementById("be-server").value
  toastr.success("Update config successfully!")
}

const send_user_message = () => {
  msg = txt_chat.value
  txt_chat.value = ""
  msg = msg.trim()
  if (msg.length > 0){
    add_user_message(msg)
    get_assistant_response(msg)
  }
}

const get_assistant_response = (user_message) => {
  set_assistant_typing(true);
  send_message(user_message, capture_image(), messages, (response) => {
    // Show response from LLM
    set_assistant_typing(false);
    let assistant_message = response.response;
    add_assistant_message(assistant_message, true);
    console.log(">> Assistant:", assistant_message)
  }, (error) => {
    set_assistant_typing(false);
    toastr.error("Error on send message ...") 
    console.log(error);
  });
}

// Main
navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  startVad();
  toastr.success("Your microphone is ready!")

}).catch((error) => {
  toastr.error("Your microphone is not working!")
  console.log(error)
});

startCam();
add_user_message("Let's get start interview");
add_assistant_message("Sure, can you introduce about yourself?", true);
