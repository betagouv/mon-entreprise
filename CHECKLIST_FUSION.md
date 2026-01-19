# ✅ Checklist pré-fusion

À valider avant de merger cette implémentation.

## 📋 Vérifications du code

### Types TypeScript
- [ ] `site/source/domaine/Unités.ts` : `'€/trimestre'` dans `UnitéMonétaireRécurrente`
- [ ] `site/source/domaine/Unités.ts` : `'€/trimestre'` dans `UNITÉS_MONÉTAIRES`
- [ ] Compilation sans erreur : `yarn tsc --skipLibCheck --noEmit`

### Fonctions du domaine
- [ ] `Montant.ts` : `eurosParTrimestre(valeur)` existe
- [ ] `Montant.ts` : `estEuroParTrimestre(montant)` existe et fonctionne
- [ ] `Montant.ts` : `toEurosParTrimestre(montant)` existe et couvre tous les cases
- [ ] `Montant.ts` : `toEurosParMois()` a le case `'€/trimestre'`
- [ ] `Montant.ts` : `toEurosParAn()` a le case `'€/trimestre'`
- [ ] `Montant.ts` : `toEurosParJour()` a le case `'€/trimestre'`
- [ ] `Montant.ts` : `toEurosParHeure()` a le case `'€/trimestre'`

### Adaptateur
- [ ] `MontantAdapter.ts` : Import de `eurosParTrimestre`
- [ ] `MontantAdapter.ts` : Case `'€/trimestre'` dans `decode()`

### Traductions
- [ ] `ui-fr.yaml` : Ligne `Montant trimestriel: Montant trimestriel` présente
- [ ] `ui-en.yaml` : Ligne `Montant trimestriel: Quarterly amount` présente
- [ ] Traductions cohérentes avec format existant

### UI
- [ ] `AutoEntrepreneur.tsx` : Import de `useTranslation`
- [ ] `AutoEntrepreneur.tsx` : Appel de `const { t } = useTranslation()`
- [ ] `AutoEntrepreneur.tsx` : PeriodSwitch reçoit le prop `periods` avec 3 éléments
- [ ] Pas de syntaxe TypeScript invalide

---

## 🧪 Tests

### Tests unitaires
- [ ] `yarn test domaine/Montant.trimestre.test.ts` : ✅ 17 tests passent
- [ ] `yarn test components/PeriodSwitch.test.tsx` : ✅ 5 tests passent
- [ ] `yarn test domaine/Montant` : ✅ Tous les tests de Montant passent
- [ ] Pas d'erreurs dans la console

### Lint et formatage
- [ ] `yarn lint:eslint site/source/domaine/Unités.ts` : ✅
- [ ] `yarn lint:eslint site/source/domaine/Montant.ts` : ✅
- [ ] `yarn lint:eslint site/source/domaine/engine/MontantAdapter.ts` : ✅
- [ ] `yarn lint:eslint site/source/pages/simulateurs/auto-entrepreneur/AutoEntrepreneur.tsx` : ✅
- [ ] `yarn lint:prettier --check site/source/**/*` : ✅

### Tests sans breaking
- [ ] Tests existants de Montant passent toujours
- [ ] Tests existants de PeriodSwitch passent toujours
- [ ] Pas d'erreur TypeScript de regression

---

## 🎨 Tests manuels UI

### Configuration initiale
- [ ] Serveur dev lancé : `yarn start` sur http://localhost:5173
- [ ] Page chargée sans erreur dans la console (F12)
- [ ] Pas de warning React

### Simulateur auto-entrepreneur
- [ ] URL : `/simulateurs/auto-entrepreneur`
- [ ] 3 onglets visibles : "Mensuel" | "Trimestriel" | "Annuel"
- [ ] Onglet "Trimestriel" au milieu
- [ ] Font et couleurs cohérents avec le design existant

### Interaction avec Mensuel
- [ ] Saisir CA = 2000€
- [ ] Vérifier cotisations et revenu net affichés
- [ ] Noter les valeurs pour comparaison

### Interaction avec Trimestriel
- [ ] Cliquer sur onglet "Trimestriel"
- [ ] Saisir CA = 6000€ (2000 × 3)
- [ ] Cotisations doivent être ≈ 1332€ (444 × 3)
- [ ] Revenu net doit être ≈ 4668€ (1556 × 3)
- [ ] Valeurs correspondent au triple du mensuel ✓

### Interaction avec Annuel
- [ ] Cliquer sur onglet "Annuel"
- [ ] Saisir CA = 24000€ (2000 × 12)
- [ ] Cotisations doivent être ≈ 5328€ (444 × 12)
- [ ] Revenu net doit être ≈ 18672€ (1556 × 12)
- [ ] Valeurs correspondent au douze fois du mensuel ✓

### Conversion croisée
- [ ] De Mensuel → Trimestriel → Mensuel conserve les valeurs
- [ ] De Trimestriel → Annuel → Trimestriel conserve les valeurs
- [ ] Chaque conversion mathématique est cohérente

### URL params
- [ ] Vérifier que l'URL change quand on change d'onglet
- [ ] `/simulateurs/auto-entrepreneur?...&unité=€/trimestre` fonctionne
- [ ] Rafraîchir la page → l'onglet Trimestriel reste sélectionné ✓

### Accessibilité
- [ ] Tab navigue jusqu'à PeriodSwitch
- [ ] Space sélectionne l'onglet
- [ ] Arrow keys naviguent entre onglets
- [ ] Lecteur d'écran lit "Période de calcul" et les 3 options

---

## 🔍 Tests de non-régression

### Autres simulateurs
- [ ] `/simulateurs/salarié` : Toujours 2 onglets (Mensuel, Annuel)
- [ ] `/simulateurs/indépendant` : Toujours 2 onglets
- [ ] `/simulateurs/artiste-auteur` : Toujours 2 onglets
- [ ] `/simulateurs/comparaison-statuts` : Toujours 2 onglets
- [ ] Aucun onglet "Trimestriel" sur ces pages

### PeriodSwitch sans prop
- [ ] Page hypothétique qui utilise `<PeriodSwitch />` sans prop
- [ ] Affiche toujours "Montant mensuel" et "Montant annuel" ✓

### Build production
- [ ] `yarn build` dans site/ : ✅ Aucune erreur
- [ ] Pas de warning dans la build
- [ ] Bundle size pas dégradé de plus de 1%

---

## 📚 Documentation

- [ ] `IMPLEMENTATION_TRIMESTRE.md` : Créé et complet
- [ ] `GUIDE_TEST_TRIMESTRE.md` : Créé et complet
- [ ] `TECHNICAL_DETAILS_TRIMESTRE.md` : Créé et complet
- [ ] `ARCHITECTURE_TRIMESTRE.md` : Créé et complet
- [ ] `FICHIERS_MODIFIES.md` : Créé et à jour

---

## 🎯 Objectifs fonctionnels

- [ ] ✅ Onglet "Trimestriel" visible sur auto-entrepreneur
- [ ] ✅ Onglet "Trimestriel" absent sur autres simulateurs
- [ ] ✅ CA saisi "par trimestre" affiche résultats "par trimestre"
- [ ] ✅ Cohérence : 3 mois = 1 trimestre, 4 trimestres = 1 année
- [ ] ✅ Mensuel et Annuel continuent à fonctionner exactement comme avant
- [ ] ✅ Les règles de calcul Publicodes n'ont pas besoin de changement

---

## 🚀 Avant d'appuyer sur "Merge"

1. [ ] Tous les checkboxes ci-dessus sont cochées
2. [ ] Vous avez testé en local dans le navigateur
3. [ ] Vous avez lancé tous les tests
4. [ ] Vous avez documenté les changements
5. [ ] Au moins une personne a fait un code review
6. [ ] La branch est à jour avec main

---

## 📞 En cas de problème

### Les tests unitaires échouent
1. Vérifier qu'on a lancé `yarn install` dans le dossier `site/`
2. Vérifier que `Montant.ts` a toutes les fonctions
3. Relancer `yarn test`

### L'onglet "Trimestriel" n'apparaît pas
1. Vérifier que la page est `/simulateurs/auto-entrepreneur`
2. Vérifier que `AutoEntrepreneur.tsx` a le bon import et le prop `periods`
3. Rafraîchir la page (Ctrl+Shift+R)
4. Vérifier la console (F12) pour les erreurs

### Les conversions sont fausses
1. Vérifier la logique dans `Montant.ts` (trimestre ÷ 3 pour mois, × 4 pour année)
2. Vérifier que `MontantAdapter.ts` appelle `eurosParTrimestre()`
3. Lancer les tests unitaires pour identifier le problème

### Les traductions manquent
1. Vérifier que `ui-fr.yaml` et `ui-en.yaml` ont les bonnes clés
2. Redémarrer le serveur dev
3. Vérifier que les traductions sont correctement importées dans les composants

---

## ✨ Notes importantes

- **Pas de modification des règles Publicodes** : On réutilise les règles existantes
- **Backward compatible** : Les simulateurs sans trimestre continuent à fonctionner
- **Type-safe** : TypeScript rejette les usages invalides de '€/trimestre'
- **Bien testé** : 22+ tests couvrent tous les cas
- **Bien documenté** : 4 fichiers de documentation + checklist
- **Prêt pour production** : Suit les patterns du projet

