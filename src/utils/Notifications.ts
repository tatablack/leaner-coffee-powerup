import Bluebird from 'bluebird';

class Notifications {
  w: Window;
  baseUrl: string;
  audioContext: AudioContext;

  Types = {
    ELAPSED: {
      audio: 'assets/looking_down.mp3',
      text: 'The timer has elapsed'
    }
  };

  constructor(window: Window, baseUrl: string) {
    this.w = window;
    this.baseUrl = baseUrl;
  }

  async load(url): Bluebird<AudioBufferSourceNode> {
    const remoteAudioFile = await fetch(url);
    const audioData = await remoteAudioFile.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(audioData);
    const sourceNode = this.audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(this.audioContext.destination);
    return sourceNode;
  }

  async play(type): Bluebird<void> {
    this.audioContext = this.audioContext || new (AudioContext || this.w.webkitAudioContext)();
    const audio = await this.load(`${this.baseUrl}/${type.audio}`);
    audio.start();
  }

  open(type, cardName): void {
    // eslint-disable-next-line no-new
    new Notification(cardName, {
      body: type.text,
      icon: `${this.baseUrl}/assets/timer.png`
    });
  }

  show(type, cardName) {
    if ((!('Notification' in this.w)) || Notification.permission === 'denied') { return; }

    if (Notification.permission === 'granted') {
      this.open(type, cardName);
    } else {
      Notification.requestPermission((permission) => {
        if (permission === 'granted') {
          this.open(type, cardName);
        }
      });
    }
  }
}

export default Notifications;
