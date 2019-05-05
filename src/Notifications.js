class Notifications {
  Types = {
    ELAPSED: {
      audio: 'assets/looking_down.mp3',
      text: 'The timer has elapsed'
    }
  };

  constructor(window, baseUrl) {
    this.w = window;
    this.baseUrl = baseUrl;
    this.audioContext = new (this.w.AudioContext || this.w.webkitAudioContext)();
  }

  load(url) {
    return fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        const sourceNode = this.audioContext.createBufferSource();
        sourceNode.buffer = audioBuffer;
        sourceNode.connect(this.audioContext.destination);
        return sourceNode;
      });
  }

  async play(type) {
    const audio = await this.load(`${this.baseUrl}/${type.audio}`);
    audio.start();
  }

  open(type, cardName) {
    // eslint-disable-next-line no-new
    new this.w.Notification(cardName, {
      body: type.text,
      icon: `${this.baseUrl}/assets/timer.png`
    });
  }

  show(type, cardName) {
    if ((!('Notification' in this.w)) || this.w.Notification.permission === 'denied') { return; }

    if (this.w.Notification.permission === 'granted') {
      this.open(type, cardName);
    } else {
      this.w.Notification.requestPermission((permission) => {
        if (permission === 'granted') {
          this.open(type, cardName);
        }
      });
    }
  }
}

export default Notifications;
