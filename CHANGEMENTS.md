# Site Ambroise Partners : version 2 (12 octobre 2026)

Copie du site d'origine (`Ambroise-Partners-main`, qui reste intacte) avec les changements validés.

## Ce qui change

- **Équipe** : section *Team* sur fond marine, en bas de page avant le contact : photo, nom, titre et lien LinkedIn (format Valmont, sans bios). Photos tirées de la proposition Theraclion, passées en noir et blanc sur fond gris clair (`public/team/`).
- **Chiffres clés** : en bas du hero dès l'arrivée sur le site ($90bn+, 15+ ans, 100+ sociétés, Paris · London) ; en bandeau sous le hero sur mobile.
- **Hero** :
  - l'animation ADN est plus courte (360 px de défilement au lieu de 1 500), et la section Services glisse par-dessus le hero au lieu d'attendre la fin d'un écran vide ;
  - l'hélice d'ADN passe sur la droite pour ne plus couper le titre ; plus de boutons sous le titre ;
  - la ligne de services est alignée sur les 4 lignes de métier ;
  - le texte s'efface avant que le fond ne devienne blanc.
- **Mise en page** : sections resserrées pour tenir chacune dans une fenêtre (titres, marges, Approach en 3 colonnes, photos d'expertise moins hautes), logo d'une seule couleur.
- **Our Approach** : trois animations (canvas) : une hélice d'ADN qui tourne, un globe qui pivote des Amériques à l'Asie avec des liens depuis Paris vers Londres, Bâle, Boston, New York, San Francisco, São Paulo, Dubaï, Hong Kong et Tokyo, et une jauge qui fait le tour des étapes d'un mandat (Mandate → Closing). Elles ne tournent que lorsque la section est à l'écran.
- **Typographie** : deux familles (Lora pour les titres, DM Sans pour le texte), deux graisses chacune et une échelle de six tailles déclarée une fois (`--fs-*`) ; les polices chargées passent de 7 à 4 fichiers. Chiffres clés plus petits, sans séparateurs ; lien LinkedIn de l'équipe sans cadre.
- **Fonds** : alternance bleu clair / blanc (Services, Approach, Expertise et secteurs, Process), équipe sur fond marine ; le dégradé du hero passe par un bleu ardoise plus sourd.
- **Services** : quatre cartes sur une ligne, toutes visibles au lieu d'onglets qui défilaient. *Private Capital Raising* et *Public Capital Markets* sont regroupés en *Capital Raising*, comme dans le deck.
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

1. **Statut réglementaire** (CIF/ORIAS, FCA) : à ajouter dans les mentions légales si applicable.

## Mettre en ligne

```bash
npm install
npm run build      # vérification locale
```

Puis déployer comme d'habitude sur Vercel. Après la mise en ligne, vérifier l'aperçu LinkedIn avec le Post Inspector : https://www.linkedin.com/post-inspector/
