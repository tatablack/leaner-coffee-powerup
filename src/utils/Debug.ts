import { Trello } from '../types/TrelloPowerUp';

import BoardStorage from '../storage/BoardStorage';
import { CardStorage } from '../storage/CardStorage';

/* eslint-disable no-console */
class Debug {
  static async showData(t: Trello.PowerUp.IFrame): Promise<void> {
    console.groupCollapsed('Current context');
    console.log(JSON.stringify(t.getContext(), null, 2));
    console.groupEnd();

    const boardData = await t.getAll();
    console.groupCollapsed('Board data');
    console.log(JSON.stringify(boardData, null, 2));
    console.groupEnd();

    const cards = await t.cards('id', 'name');
    const cardsDataPromise = cards.map(async (card) => {
      const cardData = await t.get(card.id, 'shared');
      return { name: card.name, ...cardData };
    });

    const cardsData = await Promise.all(cardsDataPromise);
    cardsData.forEach((card) => {
      console.groupCollapsed('Card data');
      // console.log(card);
      console.log(JSON.stringify(card, null, 2));
      console.groupEnd();
    });
  }

  static async wipeData(t: Trello.PowerUp.IFrame, cardStorage: CardStorage, boardStorage: BoardStorage): Promise<void> {
    await boardStorage.deleteMultiple(t, [
      BoardStorage.DISCUSSION_STATUS,
      BoardStorage.DISCUSSION_CARD_ID,
      BoardStorage.DISCUSSION_STARTED_AT,
      BoardStorage.DISCUSSION_PREVIOUS_ELAPSED,
      BoardStorage.DISCUSSION_INTERVAL_ID
    ]);

    const cards = await t.cards('all');

    Promise.all(cards.map(async (card) => {
      await cardStorage.deleteMultiple(t, [
        CardStorage.DISCUSSION_STATUS,
        CardStorage.DISCUSSION_ELAPSED,
        CardStorage.DISCUSSION_THUMBS,
        CardStorage.VOTES
      ], card.id);
    })).then(() => {
      console.log('Data wipe finished');
    });
  }
}

export default Debug;
