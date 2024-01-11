let isRecording = false;
let mediaRecorder;
let audioChunks = [];

async function startRecording() {
  // Start recording
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = audioUrl;
    a.download = "recorded_audio.wav";
    a.click();

    // Clean up
    audioChunks = [];
    URL.revokeObjectURL(audioUrl);

    // Reset button text
    document.getElementById("recordButton").innerText = "Record";
  };

  mediaRecorder.start();
  isRecording = true;

  // Update button text when recording starts
  document.getElementById("recordButton").innerText = "Recording!";
}

function stopRecording() {
  // Stop recording
  if (isRecording) {
    mediaRecorder.stop();
    isRecording = false;
  }
}
