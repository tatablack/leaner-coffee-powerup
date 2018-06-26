import { StorageVisibility } from './TrelloConstants';
import BoardStorage from './storage/BoardStorage';
import CardStorage from './storage/CardStorage';

class Debug {
  static async showData(t, Promise) {
    const boardData = await t.getAll();
    const cards = await t.cards('all');

    console.groupCollapsed('Current context');
    console.log(JSON.stringify(t.getContext(), null, 2));
    console.groupEnd();

    console.groupCollapsed('Board data');
    console.log(JSON.stringify(boardData, null, 2));
    console.groupEnd();

    const cardsPromises = Promise.map(cards, card =>
      t.get(card.id, StorageVisibility.SHARED));

    cardsPromises.then(cardsData => cardsData.forEach((card) => {
      console.groupCollapsed('Card data');
      console.log(JSON.stringify(card, null, 2));
      console.groupEnd();
    }));
  }

  static async wipeData(t, Promise, cardStorage, boardStorage) {
    boardStorage.deleteMultiple(t, [
      BoardStorage.DISCUSSION_STATUS,
      BoardStorage.DISCUSSION_CARD_ID,
      BoardStorage.DISCUSSION_STARTED_AT,
      BoardStorage.DISCUSSION_PREVIOUS_ELAPSED,
      BoardStorage.DISCUSSION_INTERVAL_ID
    ]);

    const cards = await t.cards('all');

    Promise.all(cards.map(async (card) => {
      await cardStorage.deleteMultipleById(t, [
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
