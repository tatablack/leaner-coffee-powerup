**Cos'è la tecnica del Lean Coffee?**

Dal [sito ufficiale](http://leancoffee.org/) (trad. nostra):

    Lean Coffee è un tipo di meeting strutturato, ma senza un'agenda predefinita.

Questo è un esempio di sessione in stile Lean Coffee:

1. 5 minuti per aggiungere nuove schede a una lista di "Argomenti di discussione"
2. 5 minuti per votare in favore di uno o più argomenti (il numero di voti per persona è fisso, di default basato sul numero di argomenti nella lista)
3. Il moderatore ordina la lista per numero di voti, e sposta la prima scheda nella lista "In discussione"
4. 5 minuti toper discutere l'argomento, con una breve introduzione della persona che l'ha proposto, che fornisce il contesto 
5. C'è un timer: quando scade, è posibile votare per decidere se continuare la discussione sullo stesso argomento o procedere oltre. In base al voto, il moderatore sposterà la scheda nella lista “Completati”, e la sostituirà con quella seguente nella lista originale
6. Si torna al punto #4, e così fino ad esaurimento (degli argomenti, o della riunione...)

La sequenza può essere semplificata o resa più complessa, ma il succo è questo.

**In che modo questo Power-Up mi aiuta?**

Una volta abilitato per una bacheca, il Power-Up fornirà:

- funzionalità di voto (in maniera simile a quanto fatto dal [Power-Up "Votazione"](http://info.trello.com/power-ups/voting))
    - un click per votare (ma va'?)
    - elenco votanti
    - possibilità di ordinare una lista per numero di voti
    - (Lean Coffee bonus!) vincola il numero di voti per persona in base alle regole del multivoting (aka N/3 voting)
- gestione discussioni
    - inizia/metti in pausa/termina un timer per una discussione su una scheda
    - notifiche (visuali e audio) nel momento in cui un timer scade (visibili solo all'utente che ha iniziato la discussione dall'apposito menu)
- badge per le schede e nei dettagli di una scheda, che mostrano:
    - numero di voti / elenco votanti
    - tempo trascorso in una discussione
- sezione personalizzata nei dettagli di una scheda, che mostra:
    - lo stato di una discussione (in corso o terminata)
    - una semplice interfaccia per votare e determinare se proseguire una determinata discussione o passare ad un altro argomento

---

**Badge per le schede**

Badge che mostrano il numero di voti in favore alla discussione su una certa scheda.

![Votes][CardBadgeVoting]

Badge che mostrano il tempo trascorso per una discussione tuttora in corso.

![Votes][CardBadgeOngoing]

---

**Badge per i dettagli di una scheda**

Sul retro di una scheda, al di sotto della descrizione, troverete una sezione "Discussione". Qui saranno visibili lo stato e il tempo trascorso di una discussione in corso:

![Votes][CardBackSectionOngoing]

Quando il timer scade o la discussione è esplicitamente messa in pausa, questa sezione mostra una semplice interfaccia di voto, in modo che ogni membro della bacheca possa votare per determinare come proseguire con la discussione.

![Votes][CardBackSectionPaused]

---

**Menu**

Sempre sul retro di una scheda, si trova il menu "Discussione", dal quale è possibile avviare, mettere in pausa o terminare il timer relativo.

Subito al di sotto c'è il pulsante "Vota", per esprimere il proprio interesse a discutere quella specifica scheda (o rimuoverlo - il pulsante ha due stati).

![Votes][PowerUpButtons]

[CardBadgeVoting]: https://leaner-coffee.tatablack.net/assets/readme/card_badge_voting.png
[CardBadgeOngoing]: https://leaner-coffee.tatablack.net/assets/readme/card_badge_ongoing.png
[CardBackSectionOngoing]: https://leaner-coffee.tatablack.net/assets/readme/ongoing_discussion.png
[CardBackSectionPaused]: https://leaner-coffee.tatablack.net/assets/readme/paused_discussion.png
[PowerUpButtons]: https://leaner-coffee.tatablack.net/assets/readme/buttons.png

---

**Segnalazione problemi e richieste di nuove funzionalità**

Questo è un progetto open source, e ogni contributo è benvenuto.
È possibile utilizzare [GitHub](https://github.com/tatablack/leaner-coffee-powerup/issues) per segnalare problemi o richiedere nuove funzionalità.

---

**Feedback**

Se avete una domanda che preferireste non porre pubblicamente tramite [GitHub Issues](https://github.com/tatablack/leaner-coffee-powerup/issues), inviate pure un'e-mail a [leanercoffee@tatablack.net](mailto:leanercoffee@tatablack.net).

---

**Disclaimer**

Lean Coffee(tm) è un marchio registrato da Modus Cooperandi (come riportato [qui](http://leancoffee.org/)); non abbiamo alcun legame con loro, nè con gli ideatori di questa tecnica. Semplicemente, ci siamo trovati di frequente in sessioni in stile Lean Coffee che usavano Trello, e volevamo semplificarci la vita. Una volta dimostrata l'utilità del power-up, beh, condividerlo era l'ovvio passo successivo.

---

**Riconoscimenti**

[Moka Pot](https://thenounproject.com/ralfschmitzer/collection/coffee-bar/?i=628401 "Moka Pot") di Ralf Schmitzer da [the Noun Project](http://thenounproject.com/ "The Noun Project").

[External Link](https://thenounproject.com/term/external-link/189137/ "External Link") di Laurent Canivet da [the Noun Project](http://thenounproject.com/ "The Noun Project").
