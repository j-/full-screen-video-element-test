const width = 100;
const height = 100;

const main = async () => {
  if (!document.fullscreenEnabled) {
    alert('Warning: `document.fullscreenEnabled` was `' + document.fullscreenEnabled +  '`, expected `true`.');
  }
  
  const video = document.getElementById('video') as HTMLVideoElement;
  if (!video) throw new Error('No video element found');
  
  if (typeof video.requestFullscreen !== 'function') {
    alert('Warning: `typeof video.requestFullscreen` was `' + JSON.stringify(typeof video.requestFullscreen) +  '`, expected `"function""`.');
  }
  
  const buttonRequestFullscreen = document.getElementById('button-request-fullscreen') as HTMLButtonElement;
  if (!buttonRequestFullscreen) throw new Error('No fullscreen button found');

  buttonRequestFullscreen.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await video.requestFullscreen();
    } catch (err) {
      alert(`Error requesting full screen:\n\n${err}`);
    }
  });

  const buttonWebkitEnterFullscreen = document.getElementById('button-webkit-enter-fullscreen') as HTMLButtonElement;
  if (!buttonWebkitEnterFullscreen) throw new Error('No fullscreen button found');

  buttonWebkitEnterFullscreen.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await (video as HTMLVideoElement & {
        webkitEnterFullscreen: () => Promise<void>;
      }).webkitEnterFullscreen();
    } catch (err) {
      alert(`Error entering full screen (webkit):\n\n${err}`);
    }
  });

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (!canvas) throw new Error('No canvas element found');

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  if (!ctx) throw new Error('Unable to get 2D rendering context');

  const buttonColors = document.getElementsByClassName('button-color') as HTMLCollectionOf<HTMLButtonElement>;
  if (buttonColors.length < 1) throw new Error('No color buttons found');

  for (const buttonColor of buttonColors) {
    buttonColor.addEventListener('click', async (e) => {
      e.preventDefault();
      const currentColor = (e.currentTarget as HTMLButtonElement).value;
      try {
        ctx.fillStyle = currentColor;
        ctx.fillRect(0, 0, width, height);
    
        const stream = canvas.captureStream(0);
        const [track] = stream.getVideoTracks() as CanvasCaptureMediaStreamTrack[];
        track.requestFrame();
    
        video.srcObject = new MediaStream([track]);
      } catch (err) {
        alert(`Error updating test video:\n\n${err}`);
      }
    });
  }
};

(async () => {
  try {
    await main();
  } catch (err) {
    alert(`Error initializing application:\n\n${err}`);
  }
})();
