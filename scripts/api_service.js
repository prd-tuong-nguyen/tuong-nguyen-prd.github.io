BASE_URL = "https://e025-3-231-99-84.ngrok-free.app"

axios.defaults.baseURL = BASE_URL
document.getElementById("be-server").value = BASE_URL

const send_message = (text, image, messages, callback, on_error) => {
    axios.post('/virtual-assistant/message', {
        ID: localStorage.getItem("user_id"),
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
        ID: localStorage.getItem("user_id"),
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
// Upload file using axios
const upload_cv = (file, callback, error) => {
    let formData = new FormData();
    formData.append("file", file);
    axios.post(`/virtual-assistant/cv-submission?user_id=${localStorage.getItem("user_id")}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(function (response) {
        callback(response.data)
      })
      .catch(error);
}