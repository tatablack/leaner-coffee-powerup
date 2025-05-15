import { ErrorReporterInjector } from "./Errors";
import { bindAll } from "./Scope";

export type NotificationType = {
  [key in "audio" | "text"]: string;
};

@ErrorReporterInjector
class Notifications {
  w: Window;
  baseUrl: string;
  audioContext: AudioContext;

  constructor(window: Window, baseUrl: string) {
    this.w = window;
    this.baseUrl = baseUrl;
    bindAll(this);
  }

  async load(url: string): Promise<AudioBufferSourceNode> {
    const remoteAudioFile = await fetch(url);
    const audioData = await remoteAudioFile.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(audioData);
    const sourceNode = this.audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(this.audioContext.destination);
    return sourceNode;
  }

  async play(type: NotificationType): Promise<void> {
    this.audioContext =
      this.audioContext || new (AudioContext || this.w.webkitAudioContext)();
    const audio = await this.load(`${this.baseUrl}/${type.audio}`);
    audio.start();
  }

  open(type: NotificationType, cardName: string): void {
    new Notification(cardName, {
      body: type.text,
      icon: `${this.baseUrl}/assets/timer.png`,
    });
  }

  show(type: NotificationType, cardName: string): void {
    if (!("Notification" in this.w) || Notification.permission === "denied") {
      return;
    }

    if (Notification.permission === "granted") {
      this.open(type, cardName);
    } else {
      Notification.requestPermission((permission) => {
        if (permission === "granted") {
          this.open(type, cardName);
        }
      });
    }
  }
}

export default Notifications;
