# Fix: Visualisation des images dans la section Nouveautés

## Problème (Issue #2928)

Les images dans la section "Nouveautés" (https://mon-entreprise.urssaf.fr/nouveautés/) ne s'affichaient pas correctement. Cela était dû à :
- URLs des images hébergées sur GitHub causant des erreurs CORS (`NS_BINDING_ABORT`)
- Dépendance envers GitHub pour l'affichage des images
- Pas d'alt text pour l'accessibilité

## Solution

### Approche : Télécharger et héberger les images localement

1. **Téléchargement automatique** : Le script `fetch-releases.js` télécharge maintenant les images depuis GitHub lors de la récupération des releases
2. **Stockage local** : Les images sont sauvegardées dans `site/source/public/data/releases-images/`
3. **Remplacement d'URLs** : Les URLs GitHub sont remplacées par des chemins locaux dans le markdown
4. **Accessibilité** : Les alt text des images sont préservés du markdown original

### Fichiers modifiés

#### `site/scripts/fetch-releases.js`
- Ajout de `createImagesDir()` : Crée le dossier `releases-images` s'il n'existe pas
- Ajout de `downloadAndReplaceImages()` : 
  - Extrait les URLs d'images du markdown avec une regex
  - Télécharge chaque image depuis GitHub
  - Remplace les URLs absolues par des chemins locaux (`/data/releases-images/nomfichier`)
  - Préserve les alt text pour l'accessibilité
  - Gère les erreurs gracieusement (garde l'URL originale si le téléchargement échoue)
- Modification de `fetchReleases()` : Traite les descriptions avec `downloadAndReplaceImages()`

### Avantages

✅ **Fiabilité** : Les images ne dépendent plus de GitHub  
✅ **Performance** : Images stockées localement, pas de CORS  
✅ **Accessibilité** : Alt text préservés pour les lecteurs d'écran  
✅ **Flexibilité** : Gestion gracieuse des erreurs de téléchargement  
✅ **Maintenabilité** : Solution automatisée, pas de maintenance manuelle  

### Format des images supportées

Les images extraites doivent provenir de GitHub Assets avec le format :
```
![alt text](https://github.com/betagouv/mon-entreprise/assets/userid/uuid.extension)
```

### Tests

Le script a été testé pour :
- ✅ Extraction correcte des URLs d'image du markdown
- ✅ Téléchargement des images
- ✅ Remplacement des URLs par des chemins locaux
- ✅ Préservation des alt text
- ✅ Gestion des erreurs sans bloquer le processus

### Logs

Lors de l'exécution du script, vous verrez des messages comme :
```
✓ Downloaded image: 5abf6516-10e1-4360-9cc7-be47f33be1c7.png
✓ Downloaded image: abc123def-efgh-ijkl-mnop-qrstuvwxyz.jpg
```

### Notes de déploiement

1. Le dossier `site/source/public/data/releases-images/` doit être versionnée avec le code
2. Les images seront téléchargées automatiquement lors du build
3. Aucune configuration supplémentaire requise (utilise le token GitHub existant)
