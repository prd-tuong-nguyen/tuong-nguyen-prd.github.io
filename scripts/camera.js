const stogle_webcam = () => {
    if (webcamElement.srcObject != null) {
        stopCam()
    } else if (navigator.mediaDevices.getUserMedia) {
        startCam()
    }
}

const startCam = () => {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                webcamElement.srcObject = stream;
                btn_camera.style.color = "#006dcc"
                toastr.success("Your webcam is ready!")
            })
            .catch(function (error) {
                console.log("Something went wrong!");
                toastr.error("Your webcam is not working!")
            });
    }
};

const stopCam = () => {
    let stream = webcamElement.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    webcamElement.srcObject = null;
    btn_camera.style.color = "#2c303a"
};

const capture_image = () => {
    canvas.getContext('2d').drawImage(webcamElement, 0, 0);
    image = canvas.toDataURL("image/jpeg");
    return image
}