import { get_assistant_response } from "./script.js"
const btn_mic = document.getElementById("btn-mic")

let myvad = null

export const pause_vad = () => {
    btn_mic.style.color = "#2c303a"
    if (myvad != null) {
        myvad.isRunning = false
        myvad.pause()
    }
}

export const resume_vad = () => {
    btn_mic.style.color = "#006dcc"
    if (myvad != null) {
        myvad.isRunning = true
        myvad.start()
    }
}
btn_mic.addEventListener("click", () => {
    if (myvad != null) {
        if (myvad.isRunning) {
            pause_vad()
        } else {
            resume_vad()
        }
    }
})

export async function startVad() {
    myvad = await vad.MicVAD.new({
        positiveSpeechThreshold: 0.8,
        // minSpeechFrames: 10,
        // preSpeechPadFrames: 10,
        // redemptionFrames: 20,
        onFrameProcessed: (probabilities) => {

        },
        onSpeechStart: () => {
            console.log("VAD is turn on!!!")
            set_user_typing(true)
        },
        onVADMisfire: () => {
            console.log("Stop mistakenly speaking")
            set_user_typing(false)
        },
        onSpeechEnd: (audio) => {
            console.log("Stop speaking")
            set_user_typing(false)
            speech_to_text(audio, (response) => {
                let user_message = response.response;
                if (user_message.length > 0){
                    add_user_message(user_message);
                    console.log(">> User:", user_message)
                    // Wait for show user message text
                    setTimeout(() => {
                        // Send text and image to server
                        get_assistant_response(user_message)
                    }, 10);
                }
            });
        },
    })
    myvad.start();
    btn_mic.style.color = "#006dcc"
}