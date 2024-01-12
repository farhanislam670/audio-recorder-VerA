let isRecording = false;
let mediaRecorder;
let audioChunks = [];

async function startRecording() {
  try {
    // Check if microphone permission is granted
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    // Start recording
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      } else {
        alert(
          "Looks like that the browser is unable to capture your audio :(."
        );
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

    document.getElementById("recordButton").innerText = "Recording!";

    mediaRecorder.start();
    isRecording = true;
  } catch (error) {
    // Handle microphone permission error
    console.error("Error accessing microphone:", error);

    alert("Please enable microphone access to use this feature.");

    // Reset button text in case of permission denial
    document.getElementById("recordButton").innerText = "Record";
  }
}

function stopRecording() {
  // Stop recording
  if (isRecording) {
    mediaRecorder.stop();
    isRecording = false;
  }
}
