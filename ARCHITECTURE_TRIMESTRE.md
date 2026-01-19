# 🏗️ Architecture - Ajout du support trimestriel

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                 AutoEntrepreneur.tsx (UI)                   │
│  • Affiche 3 onglets : Mensuel | Trimestriel | Annuel       │
│  • Utilise useTranslation() pour les libellés               │
│  • Passe prop periods={[...]} à PeriodSwitch                │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  PeriodSwitch.tsx (Composant)               │
│  • Affiche les onglets (radio buttons stylisés)             │
│  • Dispatche updateUnit(unit) vers Redux                    │
│  • Prop periods optionnel (default = [mensuel, annuel])     │
└─────────────────┬───────────────────────────────────────────┘
                  │
        updateUnit('€/trimestre')
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│               Redux Store (targetUnitSelector)              │
│  • Stocke l'unité sélectionnée : '€/mois' | '€/trimestre'│
│  • Accessible via URL : ?unité=€/trimestre                  │
│  • Persiste dans searchParams                               │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│        Publicodes Engine (avec MontantAdapter)              │
│  • Évalue les règles avec l'unité cible                     │
│  • Convert résultat via MontantAdapter.decode()             │
│  │  └─ Case '€/trimestre' → eurosParTrimestre(value)       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  Montant.ts (Types + Logic)                 │
│  ├─ eurosParTrimestre(300) → {valeur: 300, unité: '€/trimestre'} │
│  ├─ toEurosParMois(trimestre) → {valeur: 100, unité: '€/mois'} │
│  ├─ toEurosParAn(trimestre) → {valeur: 1200, unité: '€/an'} │
│  └─ toEurosParTrimestre(mois|an|jour|heure) → €/trimestre  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Unités.ts (Type System)                  │
│  export type UnitéMonétaireRécurrente =                     │
│    '€/mois' | '€/trimestre' | '€/an' | '€/jour' | '€/heure'│
│                                      ↑                       │
│                                   NOUVEAU                    │
└─────────────────────────────────────────────────────────────┘
```

## Flux de données détaillé

### Scénario : Utilisateur entre 6000€ en trimestrique

```
1. UTILISATEUR ENTRE : 6000€ [Trimestrique onglet]
   ↓
2. PeriodSwitch reçoit selectedUnit = '€/trimestre'
   ↓
3. Redux dispatch updateUnit('€/trimestre')
   ↓
4. SimulationGoal évalue :
   "dirigeant.auto-entrepreneur.chiffre d'affaires"
   avec targetUnit = '€/trimestre'
   ↓
5. Publicodes retourne :
   { nodeValue: 6000, unit: 'trimestre' }
   ↓
6. MontantAdapter.decode() s'exécute :
   switch(formattedUnit) {
     case '€/trimestre':
       return O.some(eurosParTrimestre(6000))
   }
   ↓
7. eurosParTrimestre(6000) retourne :
   Montant {
     _tag: 'Montant',
     valeur: 6000,
     unité: '€/trimestre'
   }
   ↓
8. Composant affiche : "6 000 €/trimestre"
```

### Conversion du résultat pour affichage

```
L'utilisateur a saisi 6000€/trimestre.
Les cotisations sont calculées (ex: 22.2% = 1332€/trimestre).

Si l'utilisateur switch vers MENSUEL :
  1. Redux dispatch updateUnit('€/mois')
  2. MontantAdapter reconvertit via toEurosParMois()
  3. 1332 €/trimestre → 444 €/mois (÷3)
  4. Affichage : "444 €/mois"

Si l'utilisateur switch vers ANNUEL :
  1. Redux dispatch updateUnit('€/an')
  2. MontantAdapter reconvertit via toEurosParAn()
  3. 1332 €/trimestre → 5328 €/an (×4)
  4. Affichage : "5 328 €/an"
```

## Interactions entre couches

### Couche 1 : Présentation (UI)
- `AutoEntrepreneur.tsx` - Définit les onglets
- `PeriodSwitch.tsx` - Affiche et change l'onglet
- `SimulationGoal.tsx` - Affiche le résultat avec l'unité

### Couche 2 : État (Redux)
- `targetUnitSelector` - Récupère l'unité sélectionnée
- `updateUnit(unit)` - Change l'unité sélectionnée
- Persiste dans les searchParams

### Couche 3 : Moteur (Publicodes + Adapter)
- `Publicodes Engine` - Évalue les règles
- `MontantAdapter.decode()` - Convertit l'unité Publicodes → Montant
- Parcourt tous les cases pour transformer l'unité brute

### Couche 4 : Domaine (Business Logic)
- `Montant.ts` - Types et conversions
- `Unités.ts` - Définition des types
- Logique mathématique des conversions

### Couche 5 : Localisation (i18n)
- `ui-fr.yaml` - Traduction FR
- `ui-en.yaml` - Traduction EN
- Utilisées par `useTranslation()` dans React

## Invariants à préserver

### 1. Mathématique
```
∀ montant : 
  toEurosParAn(toEurosParTrimestre(montant)) = montant
  toEurosParMois(toEurosParTrimestre(montant)) = montant ÷ 4
```

### 2. Type Safety
```
// ✅ Autorisé
const m: Montant<'€/trimestre'> = eurosParTrimestre(300)

// ❌ Non autorisé (compilation error)
const m: Montant<'€/trimestre'> = eurosParMois(300)
```

### 3. Cohérence avec Publicodes
```
Publicodes retourne :
  { nodeValue: 6000, unit: 'trimestre' }

MontantAdapter doit retourner :
  Montant { valeur: 6000, unité: '€/trimestre' }

Le format "trimestre" de Publicodes mappe exactement
vers "€/trimestre" dans notre système.
```

### 4. Non-régression
```
- Autres simulateurs continuent avec [Mensuel, Annuel]
- URL sans ?unité= continue d'utiliser €/mois par défaut
- Tous les tests existants passent toujours
```

## Points de couplage

### 🔴 Fort (à tester attentivement)
- `MontantAdapter` ↔ `Unités.ts` (doit avoir le case)
- `AutoEntrepreneur` ↔ `PeriodSwitch` (prop periods)
- `Montant.ts` ↔ Conversions (toEurosParMois, toEurosParAn, etc.)

### 🟡 Moyen (à vérifier)
- Redux ↔ URL params (persist targetUnit)
- i18n ↔ AutoEntrepreneur (traductions utilisées)
- Publicodes ↔ MontantAdapter (unit format)

### 🟢 Faible (peu de risque)
- Tests ↔ Implémentation (à jour si on suit les règles)
- Documentation ↔ Code (informelle, c'est ce fichier)

## Flux de test recommandé

```
Montant.ts (unit tests)
    ↓ (dépend de)
Unités.ts (unit tests)
    ↓ (dépend de)
MontantAdapter.ts (unit tests)
    ↓ (dépend de)
PeriodSwitch.tsx (component tests)
    ↓ (dépend de)
AutoEntrepreneur.tsx (integration tests - MANUEL)
```

## Checklist d'intégrité

Après chaque modification, vérifier :

- [ ] `UnitéMonétaireRécurrente` inclut `'€/trimestre'`
- [ ] `UNITÉS_MONÉTAIRES` inclut `'€/trimestre'`
- [ ] `eurosParTrimestre` et `estEuroParTrimestre` existent
- [ ] `toEurosParTrimestre` existe et couvre tous les cas
- [ ] `toEurosParMois`, `toEurosParAn`, `toEurosParJour`, `toEurosParHeure` ont le case `'€/trimestre'`
- [ ] `MontantAdapter` importe `eurosParTrimestre`
- [ ] `MontantAdapter.decode()` a le case `'€/trimestre'`
- [ ] `ui-fr.yaml` a `Montant trimestriel: Montant trimestriel`
- [ ] `ui-en.yaml` a `Montant trimestriel: Quarterly amount`
- [ ] `AutoEntrepreneur.tsx` utilise `useTranslation()` et passe le bon `periods`
- [ ] Tous les tests passent

