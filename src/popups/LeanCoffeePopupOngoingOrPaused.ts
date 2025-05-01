import { LeanCoffeePopupBase } from "./LeanCoffeePopupBase";

export class LeanCoffeePopupOngoingOrPaused extends LeanCoffeePopupBase {
  currentCardBeingDiscussed: string;
  currentDiscussionStatus: string;
  isRunning: boolean;
  startButton: HTMLElement;

  init(): void {
    this.currentCardBeingDiscussed = this.t.arg("currentCardBeingDiscussed");
    this.currentDiscussionStatus = this.t.arg("currentDiscussionStatus");
    this.isRunning = this.currentDiscussionStatus === "ONGOING";

    this.startButton = this.w.document.getElementById("start-button");
    this.startButton.addEventListener("click", async () => {
      await this.t.notifyParent("done");
      await this.t.closePopup();
    });

    this.prepareLocalisation();
    this.initLocaliser(this.onLocalised);
  }

  prepareLocalisation(): void {
    const messageElements: NodeListOf<HTMLElement> =
      this.w.document.querySelectorAll(".message");
    messageElements.forEach((elem: HTMLElement) => {
      elem.dataset.i18nArgs = JSON.stringify({
        card: this.currentCardBeingDiscussed,
      });
    });
  }

  onLocalised = async (): Promise<void> => {
    this.toggleFields(
      ".message",
      this.isRunning ? "ongoingRunning" : "ongoingOnHold",
    );
    this.t.localizeNode(document.body);
    await this.t.sizeTo("body");
  };
}
