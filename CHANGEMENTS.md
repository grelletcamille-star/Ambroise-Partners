# Site Ambroise Partners : version 2 (12 octobre 2026)

Copie du site d'origine (`Ambroise-Partners-main`, qui reste intacte) avec les changements validés.

## Ce qui change

- **Équipe** : nouvelle section *Team* (Camille Grellet, Thomas Guillot), avec les bios tirées de l'Overview et de la proposition MSInsight.
- **Preuves** :
  - un bandeau de chiffres sous le hero ($90bn+, 15+ ans, 100+ sociétés, Paris · London) ;
  - une section *Selected experience* (24 sociétés), avec la mention « including in previous roles ».
- **Hero** :
  - l'animation ADN est plus courte (700 px de défilement au lieu de 1 500) ;
  - deux boutons ont été ajoutés (*Discuss your project*, *Our services*) ;
  - la ligne de services est alignée sur les 4 lignes de métier ;
  - le texte s'efface avant que le fond ne devienne blanc.
- **Services** : quatre cartes toutes visibles au lieu d'onglets qui défilaient. *Private Capital Raising* et *Public Capital Markets* sont regroupés en *Capital Raising*, comme dans le deck.
- **Photos d'expertise** : un traitement bichrome bleu marine unifie les six images.
- **Détails** :
  - boutons en bleu marine ;
  - contraste du footer corrigé ;
  - « Healthcare-focused » avec un trait d'union ;
  - langue déclarée `en_GB` ;
  - meta keywords supprimée.
- **Mentions légales** : données Pappers (EURL au capital de 1 000 €, 7 rue Paul Saunière 75016 Paris, RCS Paris 981 652 373, TVA FR77981652373, directrice de publication Camille Grellet). La politique de confidentialité a été complétée de la même façon.
- **Logo** : nouveau monogramme AP dessiné (piste A avec le P), dans la navigation, le footer, les pages secondaires, la favicon, l'icône Apple et l'image de partage. Le dessin est dans `app/components/LogoMark.tsx`.
- **LinkedIn** : liens vers les profils de Camille et Thomas et vers la page entreprise (footer, pages secondaires, données structurées).
- **Image de partage** : `public/og-image.png` (1200×630) remplace le SVG, que LinkedIn n'affiche pas.
- **Bugs corrigés** :
  - le lien « Back » des pages légales pointait vers `/2` ;
  - l'écran de chargement bleu restait affiché sur les pages légales.

## À faire avant la mise en ligne

1. **Photos de l'équipe** : déposer `camille.jpg` et `thomas.jpg` (carrées, au moins 600×600) dans `public/team/`, puis renseigner `photo: '/team/camille.jpg'` dans `TEAM` (`app/page.tsx`).
2. **Statut réglementaire** (CIF/ORIAS, FCA) : à ajouter dans les mentions légales si applicable.

## Mettre en ligne

```bash
npm install
npm run build      # vérification locale
```

Puis déployer comme d'habitude sur Vercel. Après la mise en ligne, vérifier l'aperçu LinkedIn avec le Post Inspector : https://www.linkedin.com/post-inspector/
