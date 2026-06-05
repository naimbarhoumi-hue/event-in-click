# Event In Click — Site web

Site vitrine pour l'agence événementielle **Event In Click**, spécialisée dans
l'organisation d'événements haut de gamme clés en main.

## Structure des fichiers

```
event-in-click/
├── index.html            → Page principale
├── css/
│   └── style.css         → Tous les styles (+ galerie, RTL, multilingue)
├── js/
│   ├── translations.js   → Textes FR / AR / EN
│   └── script.js         → Interactions (menu, langues, galerie, formulaire)
├── assets/
│   ├── logo.jpg          → Votre logo
│   └── gallery/          → Vos photos de réalisations (event-1.jpg ... event-6.jpg)
└── README.md             → Ce fichier
```

## Comment l'utiliser

1. Décompressez le dossier.
2. Ouvrez `index.html` dans un navigateur — le site fonctionne immédiatement.

## Nouveautés de cette version

- **Logo** intégré (navbar, section À propos, footer, favicon).
- **Galerie de réalisations** avec filtres (Tous / Corporate / Privé / Culturel).
- **Site multilingue** : Français, Arabe (avec affichage RTL droite→gauche) et Anglais.
  Le bouton de langue est en haut à droite. La langue choisie est mémorisée.
- **Emplacements photo prêts** dans la galerie : ajoutez vos images dans
  `assets/gallery/` (voir ci-dessous). Un motif doré s'affiche en attendant.
- **Section témoignages clients** : modifiez les textes dans `js/translations.js`
  (clés `tes1_*`, `tes2_*`, `tes3_*`).
- **Bouton WhatsApp flottant** : toujours visible en bas à droite. Remplacez le
  numéro `216XXXXXXXX` dans `index.html` par votre numéro au format international
  (ex. 21620123456, sans + ni espaces).
- **Pied de page enrichi** : 4 colonnes (présentation, navigation, contact, réseaux
  sociaux). Le lien LinkedIn est déjà configuré. Pour Facebook, Instagram et
  WhatsApp, remplacez les URLs `https://www.facebook.com/`, `https://www.instagram.com/`
  et le numéro `216XXXXXXXX` dans `index.html` par vos vrais comptes (supprimez
  une icône en effaçant simplement son bloc `<a class="social-link">...</a>` si
  vous n'avez pas le réseau).

## Important — contenu LinkedIn (photos / vidéos)

LinkedIn interdit la récupération automatique de ses pages, et les liens vers ses
médias sont temporaires. Pour publier vos photos/vidéos LinkedIn sur le site :
téléchargez-les depuis LinkedIn, puis déposez les photos dans `assets/gallery/`
(noms `event-1.jpg` à `event-6.jpg`). Pour les vidéos, hébergez-les sur YouTube
et nous pourrons les intégrer en lecteur embarqué.


## Personnalisation

- **Logo** : remplacez `assets/logo.jpg` par votre fichier (gardez le même nom).
- **Coordonnées** : modifiez téléphone, email et adresse dans `index.html`.
- **Couleurs** : variables en haut de `css/style.css` (`--gold`, `--dark`...).
- **Galerie** : elle affiche actuellement 6 visuels d'illustration élégants
  (fichiers `event-1.svg` à `event-6.svg`). Pour mettre VOS photos :
  1. déposez vos images dans `assets/gallery/` nommées `event-1.jpg` … `event-6.jpg` ;
  2. dans `index.html`, remplacez chaque `event-1.svg` par `event-1.jpg` (et ainsi
     de suite) — il suffit de changer `.svg` en `.jpg`.
  Voir `assets/gallery/_LISEZ-MOI.txt` pour les tailles. Les cases 2 et 6 sont verticales.

- **Vidéo de fond (accueil)** : déposez un fichier `hero.mp4` dans `assets/` et
  il s'affichera automatiquement en boucle derrière le titre. Sans fichier, le
  fond doré animé reste affiché. Détails dans `assets/_VIDEO-HERO-LISEZ-MOI.txt`.
- **Textes / traductions** : tout le contenu des 3 langues est dans
  `js/translations.js`. Modifiez une phrase une seule fois par langue.

## Ajouter une langue

Dans `js/translations.js`, dupliquez un bloc de langue (ex. `en: { ... }`),
puis ajoutez un bouton `<button class="lang-btn" data-lang="xx">XX</button>`
dans la navbar et le menu mobile.

## Formulaire de contact

Fonctionnel à l'affichage mais sans envoi réel (pas de backend). Pour recevoir
les messages, intégrez un service gratuit — **Formspree**, **EmailJS** — à
l'emplacement indiqué par un commentaire dans `js/script.js`.

## Mise en ligne (gratuite)

Glissez-déposez le dossier sur **netlify.com/drop**, ou utilisez **Vercel**
ou **GitHub Pages** pour une mise en ligne instantanée.

---
© Event In Click — Vos événements à portée de clic

## Espace d'administration (Decap CMS)

Le site inclut une interface pour gérer les réalisations sans toucher au code :

- `admin/` — l'interface d'administration (accessible à l'adresse `/admin`)
- `admin/config.yml` — la configuration (ne pas modifier sauf nécessité)
- `content/realisations.json` — la liste des réalisations, lue par la galerie
- `assets/uploads/` — où les photos téléversées sont rangées

**Important** : l'interface fonctionne une fois le site publié via **GitHub + Netlify**
(avec Netlify Identity + Git Gateway activés). Voir le guide
« Guide-CMS-et-Devis-Event-In-Click ».

La galerie lit `content/realisations.json`. Si le site est simplement ouvert en
double-cliquant sur index.html (sans serveur), le navigateur bloque la lecture du
JSON : une galerie de secours s'affiche alors automatiquement. Une fois en ligne,
le contenu du CMS prend le relais. Chaque réalisation peut être une photo OU une
vidéo YouTube.

## Formulaire de devis

Le formulaire de contact inclut un champ « Date souhaitée » et envoie les demandes
par email via Formspree. Remplacez `VOTRE_ID_FORMSPREE` dans `index.html` par votre
identifiant Formspree (voir le guide).
