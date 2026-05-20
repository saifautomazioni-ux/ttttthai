# TTHAI LASH — Sito Vetrina

Landing page one-page per TTHAI LASH, Bergamo Centro.

## Struttura

```
tthailash/
├── index.html          # Pagina principale
├── css/
│   └── style.css       # Tutti gli stili
├── js/
│   └── main.js         # Nav scroll, FAQ accordion, reveal animation
└── assets/
    └── img/            # Inserisci qui le foto della galleria
```

## Come aggiungere le foto

Nella sezione **Lavori**, ogni `.gallery-item` ha già un tag `<img class="gallery-item-img">` commentato pronto all'uso.

1. Copia le foto in `assets/img/`
2. In `index.html`, dentro ogni `.gallery-item` aggiungi:
   ```html
   <img class="gallery-item-img" src="assets/img/nome-foto.jpg" alt="descrizione">
   ```

## Come aprire in locale

Apri con **Live Server** in VSCode (tasto destro su `index.html` → *Open with Live Server*).

## Link utili

- Instagram: [@tthailash](https://instagram.com/tthailash)
- PayPal: [paypal.me/tthailash](https://paypal.me/tthailash)
