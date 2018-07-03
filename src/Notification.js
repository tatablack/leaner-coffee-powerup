window.AudioContext = window.AudioContext || window.webkitAudioContext;


class Notification {
  Types = {
    ELAPSED: 'assets/looking_down.mp3'
  };

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.audioContext = new window.AudioContext();
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
    this.audio = await this.load(`${this.baseUrl}/${type}`);
    this.audio.start();
  }
}

export default Notification;
