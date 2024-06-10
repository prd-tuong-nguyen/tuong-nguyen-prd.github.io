const chat_box = document.getElementById("chat-area");
const messages = [];
const assistant_name = "OliviB";

const add_user_message = (message) => {
  content = `
    <div class="message-wrapper reverse">
      <div class="profile-picture">
        <img
          src="https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
          alt="" />
      </div>
      <div class="message-content">
        <p class="name">You</p>
        <div class="message">${message}</div>
      </div>
    </div>`
  chat_box.insertAdjacentHTML('beforeend', content);
  chat_box.scrollTop = chat_box.scrollHeight;

  messages.push({
    "role": "user",
    "content": message
  })
}

const add_assistant_message = (message, say) => {
  content = `
    <div class="message-wrapper">
      <div class="profile-picture">
        <img
          src="https://images.unsplash.com/photo-1581824283135-0666cf353f35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1276&q=80"
          alt="" />
      </div>
      <div class="message-content">
        <p class="name">${assistant_name}</p>
        <div class="message">${message}</div>
      </div>
    </div>`
  chat_box.insertAdjacentHTML('beforeend', content);
  chat_box.scrollTop = chat_box.scrollHeight;

  messages.push({
    "role": "assistant",
    "content": message
  })
  // Speak
  // if (say) {
  //   speech.text = message
  //   speaker.speak(speech);
  // }
}

const set_user_typing = (enable) => {
  if (enable) {
    content = `
      <div class="message-wrapper reverse user-typing">
        <div class="profile-picture">
          <img
            src="https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
            alt="" />
        </div>
        <div class="message-content">
          <p class="name">You</p>
          <div class="loader">
              <img height="30px" src="https://assets-v2.lottiefiles.com/a/90bdd36c-1152-11ee-bdb8-cb8fe6b15cf6/aGuSzP57JM.gif">
          </div>
        </div>
      </div>`
    set_user_typing(false)
    chat_box.insertAdjacentHTML('beforeend', content);
    chat_box.scrollTop = chat_box.scrollHeight;
  } else {
    let elements = document.querySelectorAll('div.user-typing');
    for (let i = 0; i < elements.length; i++) {
      elements[i].remove();
    }
  }
}

const set_assistant_typing = (enable) => {
  if (enable) {
    content = `
      <div class="message-wrapper assistant-typing">
        <div class="profile-picture">
          <img
            src="https://images.unsplash.com/photo-1581824283135-0666cf353f35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1276&q=80"
            alt="" />
        </div>
        <div class="message-content">
          <p class="name">${assistant_name}</p>
          <div class="loader">
              <img height="30px" src="https://assets-v2.lottiefiles.com/a/90bdd36c-1152-11ee-bdb8-cb8fe6b15cf6/aGuSzP57JM.gif">
          </div>
        </div>
      </div>`
    chat_box.insertAdjacentHTML('beforeend', content);
    chat_box.scrollTop = chat_box.scrollHeight;
  } else {
    let elements = document.querySelectorAll('div.assistant-typing');
    for (let i = 0; i < elements.length; i++) {
      elements[i].remove();
    }
  }
}

const add_upload_file_request = (message, file_name) => {
  content = `
  <div class="message-wrapper">
    <div class="profile-picture">
      <img
        src="https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
        alt="" />
    </div>
    <div class="message-content">
      <p class="name">You</p>
      <div class="message">
      <p>${message}</p>
      <div class="mb-3">
        <label for="formFile" class="form-label">Default file input example</label>
        <input class="form-control" type="file" id="${file_name}">
      </div>
      </div>
      
    </div>
  </div>`
  chat_box.insertAdjacentHTML('beforeend', content);
  chat_box.scrollTop = chat_box.scrollHeight;

  messages.push({
    "role": "assistant",
    "content": message
  })
  // Speak
  // if (say) {
  //   speech.text = message
  //   speaker.speak(speech);
  // }
}