const speak = (floatArray) => {
    // Create a new AudioContext
    const audioContext = new AudioContext({sampleRate: 24000});

    // Create an AudioBufferSourceNode
    const source = audioContext.createBufferSource();

    // Create an AudioBuffer with your array of float values
    const buffer = audioContext.createBuffer(1, floatArray.length, audioContext.sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < floatArray.length; i++) {
        channelData[i] = floatArray[i];
    }

    // Set the buffer for the AudioBufferSourceNode
    source.buffer = buffer;

    // Connect the AudioBufferSourceNode to the AudioContext's destination (i.e., speakers)
    source.connect(audioContext.destination);

    // Start playing the audio
    source.start();
}