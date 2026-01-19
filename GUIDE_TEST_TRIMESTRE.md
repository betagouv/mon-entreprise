# 🧪 Guide de test - Fonctionnalité Trimestrielle

## Avant de lancer les tests

Assurez-vous que l'environnement est correctement configuré :

```bash
# À la racine du projet
yarn install
cd site
yarn install
```

## Tests unitaires

### 1. Tests des conversions Montant (trimestre)

```bash
cd site
yarn test domaine/Montant.trimestre.test.ts
```

**Cas testés :**
- ✅ Création d'un montant €/trimestre
- ✅ Conversion trimestre → mois (÷3)
- ✅ Conversion trimestre → année (×4)
- ✅ Conversion mois → trimestre (×3)
- ✅ Conversion année → trimestre (÷4)
- ✅ Conversions croisées sans perte
- ✅ Cas auto-entrepreneur (CA trimestriel)

### 2. Tests du composant PeriodSwitch

```bash
cd site
yarn test components/PeriodSwitch.test.tsx
```

**Cas testés :**
- ✅ Affichage par défaut (mensuel, annuel)
- ✅ Affichage personnalisé (mensuel, trimestriel, annuel)
- ✅ Sélection de la période trimestrielle
- ✅ Pas de régression sur 2 périodes
- ✅ Accessibilité

### 3. Tester tous les montants

```bash
cd site
yarn test domaine/Montant
```

## Tests manuels (dans le navigateur)

### 1. Accéder au simulateur auto-entrepreneur

```bash
cd site
yarn start  # http://localhost:5173
```

Naviguer vers : `/simulateurs/auto-entrepreneur`

### 2. Vérifier la présence du nouvel onglet

- ✅ 3 onglets visibles : "Mensuel", "Trimestriel", "Annuel"
- ✅ "Trimestriel" est au milieu des deux autres

### 3. Test : CA mensuel → trimestriel

**Données de test :**

| Onglet      | Chiffre d'affaires | Cotisations (22.2%) | Revenu net |
|-------------|-------------------|----------------------|-----------|
| Mensuel     | 2 000 €           | 444 €                | 1 556 €   |
| Trimestriel | 6 000 €           | 1 332 €              | 4 668 €   |
| Annuel      | 24 000 €          | 5 328 €              | 18 672 €  |

**Procédure :**
1. Saisir 2 000€ en mensuel
2. Noter le revenu net
3. Cliquer sur "Trimestriel"
4. Saisir 6 000€ (= 2 000 × 3)
5. **Le revenu net doit être × 3** (4 668€)
6. Cliquer sur "Annuel"
7. Saisir 24 000€ (= 2 000 × 12)
8. **Le revenu net doit être × 12** (18 672€)

### 4. Test : URL avec paramètre de période

Tester la conservation de l'état à travers les onglets :

```
http://localhost:5173/simulateurs/auto-entrepreneur?unité=€/trimestre&dirigeant.auto-entrepreneur.chiffre%20d%27affaires=10000
```

- ✅ Onglet "Trimestriel" sélectionné
- ✅ CA de 10 000€ saisi
- ✅ Résultats affichés en trimestriel

### 5. Test : Non-régression sur autres simulateurs

Vérifier que les autres simulateurs ne sont pas affectés :

```bash
- /simulateurs/salarié          → Toujours 2 onglets (Mensuel, Annuel)
- /simulateurs/indépendant      → Toujours 2 onglets (Mensuel, Annuel)
- /simulateurs/artiste-auteur   → Toujours 2 onglets (Mensuel, Annuel)
```

## Test d'accessibilité

### 1. Clavier (Tab, Space)

```
1. Appuyer sur Tab pour naviguer jusqu'à PeriodSwitch
2. Vérifier que l'onglet actif est visuellement distinct
3. Appuyer sur Space/Arrow pour changer d'onglet
4. Vérifier que le changement fonctionne
```

### 2. Lecteur d'écran

```
1. Activer VoiceOver (Mac) ou NVDA (Windows)
2. Naviguer vers le simulateur auto-entrepreneur
3. Vérifier que "Période de calcul" est lu
4. Vérifier que les 3 options sont lues : "Mensuel", "Trimestriel", "Annuel"
5. Vérifier que l'option sélectionnée est indiquée
```

## Tests de validation TypeScript

```bash
cd site
yarn tsc --skipLibCheck --noEmit
```

Doit passer sans erreur.

## Tests ESLint & Prettier

```bash
cd site
yarn lint:eslint
yarn lint:prettier --check
```

Doit passer sans erreur.

## Cas limites à tester

### 1. Montants non-entiers

**Teste les arrondis au centime :**
```
Mensuel : 100€ → Trimestriel : 300€ → Mensuel : 100€ ✓
Annuel : 10 000€ → Trimestriel : 2 500€ → Annuel : 10 000€ ✓
```

### 2. Montants très petits

```
Mensuel : 1€ → Trimestriel : 3€ → Annuel : 36€ ✓
```

### 3. Montants très grands

```
Mensuel : 10 000€ → Trimestriel : 30 000€ → Annuel : 120 000€ ✓
```

## Checklist finale

Avant de merger :

- [ ] ✅ Tous les tests unitaires passent (`yarn test`)
- [ ] ✅ Pas d'erreurs TypeScript (`yarn tsc --skipLibCheck --noEmit`)
- [ ] ✅ Pas d'erreurs ESLint (`yarn lint:eslint`)
- [ ] ✅ Pas d'erreurs Prettier (`yarn lint:prettier --check`)
- [ ] ✅ 3 onglets visibles sur auto-entrepreneur
- [ ] ✅ Conversions correctes (×3 mois, ×4 année)
- [ ] ✅ Pas de régression sur autres simulateurs
- [ ] ✅ Accessibilité au clavier fonctionne
- [ ] ✅ URL avec paramètre `?unité=€/trimestre` fonctionne
- [ ] ✅ Les traductions i18n sont en place (FR et EN)

## Dépannage

### L'onglet "Trimestriel" n'apparaît pas

**Solution :**
1. Vérifier que vous êtes sur `/simulateurs/auto-entrepreneur`
2. Rafraîchir la page (Ctrl+Maj+R)
3. Vérifier les erreurs dans la console (F12)
4. Vérifier que `AutoEntrepreneur.tsx` a le bon `periods` prop

### Les conversions ne sont pas correctes

**Solution :**
1. Vérifier les imports dans `MontantAdapter.ts` (doit avoir `eurosParTrimestre`)
2. Vérifier le type `UnitéMonétaireRécurrente` dans `Unités.ts` (doit inclure `'€/trimestre'`)
3. Vérifier les fonctions `toEurosParTrimestre` dans `Montant.ts`

### Les traductions manquent

**Solution :**
1. Vérifier que `ui-fr.yaml` a : `Montant trimestriel: Montant trimestriel`
2. Vérifier que `ui-en.yaml` a : `Montant trimestriel: Quarterly amount`
3. Redémarrer le serveur dev

