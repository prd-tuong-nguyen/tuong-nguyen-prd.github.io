BASE_URL = "https://694c50e1576c.ngrok.app"

axios.defaults.baseURL = BASE_URL
document.getElementById("be-server").value = BASE_URL

const send_message = (text, image, messages, callback, on_error) => {

    axios.post('/virtual-assistant/message', {
        ID: "tuongnh",
        text: text,
        image: image,
        messages: messages.slice(-5, -1)
      })
      .then(function (response) {
        callback(response.data)
      })
      .catch(function (error) {
        on_error(error)
      });
}

const speech_to_text = (audio_array, callback) => {
    axios.post('/virtual-assistant/speech-to-text', {
        ID: "tuongnh",
        voice: Array.from(audio_array),
      })
      .then(function (response) {
        callback(response.data)
      })
      .catch(function (error) {
        toastr.error("Error on speech to text ...") 
        console.log(error);
      });
}