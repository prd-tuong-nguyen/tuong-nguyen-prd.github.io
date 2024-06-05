const switchMode = document.querySelector('button.mode-switch')
const body = document.querySelector('body')
const closeBtn = document.querySelector('.btn-close-right')
const rightSide = document.querySelector('.right-side')
const expandBtn = document.querySelector('.expand-btn');
const canvas = document.getElementById('canvas');
const chat_box = document.getElementById("chat-area");
const btn_mic = document.getElementById("btn-mic")
const btn_camera = document.getElementById("btn-camera")
const txt_chat = document.getElementById("chat-input")
import { text_to_speech } from "./avatar_interviewer.js";
import { startVad, pause_vad, resume_vad } from "./vad.js";

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

const btn_update_setting = document.getElementById("save-btn")
btn_update_setting.addEventListener("click", update_setting)

const send_user_message = () => {
  msg = txt_chat.value
  txt_chat.value = ""
  msg = msg.trim()
  if (msg.length > 0){
    add_user_message(msg)
    get_assistant_response(msg)
  }
}

const btn_send_msg = document.getElementById("btn-send-msg")
btn_send_msg.addEventListener("click", send_user_message)

export const get_assistant_response = (user_message) => {
  set_assistant_typing(true);
  let startTimer = new Date().getTime();
  send_message(user_message, capture_image(), messages, (response) => {
    // Show response from LLM
    set_assistant_typing(false);
    let assistant_message = response.response;
    // let assistant_voice = response.voice;
    add_assistant_message(assistant_message, false);
    console.log(">> Time:", new Date().getTime() - startTimer)
    startTimer = new Date().getTime();
    text_to_speech(assistant_message)
    console.log(">> Time 123123123:", new Date().getTime() - startTimer)
    // console.log(assistant_voice)
    // speak(assistant_voice)
    // console.log(">> Assistant:", assistant_message)
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
add_assistant_message("Sure, can you introduce about yourself?", false);
