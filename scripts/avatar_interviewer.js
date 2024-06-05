import { TalkingHead } from "talkinghead";
let head; // TalkingHead instance
let tts = null; // OfflineTTS instance
let audioCtx = null; // Audio context
let audio_object; // Audio object

document.addEventListener("DOMContentLoaded", async function (e) {
  // Instantiate the class
  // NOTE: Text-to-speech not initialized
  const nodeAvatar = document.getElementById("avatar");
  head = new TalkingHead(nodeAvatar, {
    ttsEndpoint:
      "https://eu-texttospeech.googleapis.com/v1beta1/text:synthesize",
    cameraView: "head",
  });

  // Load and show the avatar
  try {
    await head.showAvatar(
      {
        url: "./avatars/rose.glb",
        body: "F",
        avatarMood: "neutral",
        lipsyncLang: "en",
      },
      (ev) => {
        if (ev.lengthComputable) {
          let val = Math.min(100, Math.round((ev.loaded / ev.total) * 100));
          console.log("Loading: " + val + "%");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }

  // load test-to-speech
  try {
    console.log("Model files downloaded!");
    console.log("Initializing tts ......");
    tts = createOfflineTts(Module);
    tts.speakerId = 0;
    tts.speed = 0.8;

    console.log("TTS initialized!");
    } catch (error) {
      console.log(error);
    }
});

export const text_to_speech = (text) => {
  console.log("Text to speech:", text);
    if (tts) {
      let audio = tts.generate({
        text: text,
        sid: tts.speakerId,
        speed: tts.speed,
      });

      if (!audioCtx) {
        audioCtx = new AudioContext({ sampleRate: tts.sampleRate });
      }
      const buffer = audioCtx.createBuffer(1, audio.samples.length, tts.sampleRate);
      const ptr = buffer.getChannelData(0);
      for (let i = 0; i < audio.samples.length; i++) {
        ptr[i] = audio.samples[i];
      }
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      // source.start();
      createAudioTag(audio);
    }
}

async function createAudioTag(generateAudio) {
  const blob = toWav(generateAudio.samples, generateAudio.sampleRate);
  // save to time.wav file
  // const a = document.createElement('a');
  // const audioURL = window.URL.createObjectURL(blob);
  // a.href = audioURL;
  // a.download = `${text}.wav`;
  // a.click();

  // Call function loadAudio
  await loadAudio(blob);
  console.log("Audio tag created", audio_object);
}

async function loadAudio(file) {
  console.log("Loading audio file");
  try {
    // Whisper request
    const formdata = new FormData();
    formdata.append("upload_file", file);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    const response = await fetch(
      "https://devrasaapi.paradox.ai/nluapi/ray/whisper_app/audio_to_text",
      requestOptions
    );

    if (response.ok) {
      const json = await response.json();
      console.log("Transcription:");
      console.log(json);
      // Fetch audio
      if (json.words && json.words.length) {
        console.log("Audio file found");
        let reader = new FileReader();

        reader.onload = async (readerEvent) => {
          let arraybuffer = readerEvent.target.result;
        };
        // file.ArrayBuffer.result
        let arraybuffer = await readFileAsArrayBuffer(file);
        let audiobuffer = await head.audioCtx.decodeAudioData(arraybuffer);
        console.log("Audio buffer:");
        // TalkingHead audio object
        audio_object = {
          audio: audiobuffer,
          words: [],
          wtimes: [],
          wdurations: [],
          markers: [],
          mtimes: [],
        };

        // Add words to the audio object
        json.words.forEach((x) => {
          audio_object.words.push(x.word);
          audio_object.wtimes.push(1000 * x.start - 150);
          audio_object.wdurations.push(1000 * (x.end - x.start));
        });

        // Callback function to make the avatar look at the camera
        const startSegment = async () => {
          console.log("Start segment");
          head.lookAtCamera(500);
          head.speakWithHands();
        };

        // Add timed callback markers to the audio object
        json.segments.forEach((x) => {
          if (x.start > 2 && x.text.length > 10) {
            audio_object.markers.push(startSegment);
            audio_object.mtimes.push(1000 * x.start - 1000);
          }
        });
        console.log("Audio object:", audio_object);
        head.speakAudio(audio_object);
      }
    }
    console.log("Done");
  } catch (error) {
    console.log(error);
  }
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsArrayBuffer(file);
  });
}



// this function is copied/modified from
// https://gist.github.com/meziantou/edb7217fddfbb70e899e
function toWav(floatSamples, sampleRate) {
  let samples = new Int16Array(floatSamples.length);
  for (let i = 0; i < samples.length; ++i) {
    let s = floatSamples[i];
    if (s >= 1) s = 1;
    else if (s <= -1) s = -1;

    samples[i] = s * 32767;
  }

  let buf = new ArrayBuffer(44 + samples.length * 2);
  var view = new DataView(buf);

  // http://soundfile.sapp.org/doc/WaveFormat/
  //                   F F I R
  view.setUint32(0, 0x46464952, true); // chunkID
  view.setUint32(4, 36 + samples.length * 2, true); // chunkSize
  //                   E V A W
  view.setUint32(8, 0x45564157, true); // format
  //
  //                      t m f
  view.setUint32(12, 0x20746d66, true); // subchunk1ID
  view.setUint32(16, 16, true); // subchunk1Size, 16 for PCM
  view.setUint32(20, 1, true); // audioFormat, 1 for PCM
  view.setUint16(22, 1, true); // numChannels: 1 channel
  view.setUint32(24, sampleRate, true); // sampleRate
  view.setUint32(28, sampleRate * 2, true); // byteRate
  view.setUint16(32, 2, true); // blockAlign
  view.setUint16(34, 16, true); // bitsPerSample
  view.setUint32(36, 0x61746164, true); // Subchunk2ID
  view.setUint32(40, samples.length * 2, true); // subchunk2Size

  let offset = 44;
  for (let i = 0; i < samples.length; ++i) {
    view.setInt16(offset, samples[i], true);
    offset += 2;
  }

  return new Blob([view], { type: "audio/wav" });
}