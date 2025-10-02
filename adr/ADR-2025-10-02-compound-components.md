# ADR : Pattern Compound Components pour les composants React

## Date
2025-10-02

## Contexte

On refactorise le simulateur location-de-meublé pour passer d'une interface séquentielle à une interface de comparaison en colonnes. On veut créer des composants réutilisables qui soient flexibles tout en gardant le contrôle sur le rendu.

## Problématique

Actuellement, nos composants de comparaison ressemblent à ça :

```tsx
// Dans DetailsRowCards.tsx - lourd et couplé
<StatusCard
  statut={sameValueOptions.map(({ name }) => name)}
  footerContent={footer?.(statusObject.engine)}
  isBestOption={bestOptionValue === statusObject.name}
>
  <StyledBody as="div">
    <StyledDiv>
      <span>
        <Value expression={expressionOrDottedName} engine={statusObject.engine} />
        {label && ' '}
        {label && label}
      </span>
      <StyledRuleLink documentationPath={statusObject.name} dottedName={dottedName}>
        <HelpIcon />
      </StyledRuleLink>
      {warning?.(statusObject.engine)}
    </StyledDiv>
    <Precisions>
      <Value expression={evolutionDottedName} engine={statusObject.engine} />
      {evolutionLabel}
    </Precisions>
  </StyledBody>
</StatusCard>
```

**Problèmes** :
- Plein de `StyledXXX` partout qui polluent le code
- Logique de layout mélangée avec le contenu
- Difficile de réutiliser dans un autre contexte
- Props `footerContent`, `isBestOption` spécifiques à un cas d'usage
- Impossible de composer librement le contenu

Comment créer des composants qui permettent de faire ça de manière plus propre et flexible ?

## Solution : Compound Components

On expose des sous-composants comme propriétés du composant principal :

```tsx
<CarteComparaison meilleureOption>
  <CarteComparaison.Étiquettes>
    <RégimeTag régime="RG" />
  </CarteComparaison.Étiquettes>
  <CarteComparaison.Contenu>
    <span>1 800€</span>
  </CarteComparaison.Contenu>
</CarteComparaison>
```

Le composant parent peut alors organiser les enfants comme il veut :

```tsx
const CarteComparaison = ({ children, meilleureOption }) => {
  // On récupère les sous-composants
  const étiquettes = React.Children.toArray(children).find(
    child => child.type === CarteComparaison.Étiquettes
  )
  const contenu = React.Children.toArray(children).find(
    child => child.type === CarteComparaison.Contenu
  )

  // On contrôle complètement le layout
  return (
    <Card>
      <Header>{étiquettes}</Header>
      <MainContent highlighted={meilleureOption}>
        {contenu}
      </MainContent>
    </Card>
  )
}
```

## Avantages

✅ **API intuitive** : Ça ressemble à du HTML, facile à comprendre
✅ **Flexibilité** : L'utilisateur met ce qu'il veut dans chaque section
✅ **Contrôle du layout** : On garde la main sur l'organisation finale
✅ **Pas de StyledBody partout** : Les styles restent dans le composant
✅ **Facile à étendre** : Ajouter un nouveau sous-composant ne casse rien

## Inconvénients

❌ **Plus de code initial** : Un peu plus long à mettre en place
❌ **React.Children** : Peut être moins performant avec beaucoup d'enfants

## Alternatives qu'on a écartées

### Option 1 : StyledBody partout (ce qu'on fait actuellement)

```tsx
<StatusCard>
  <StyledBody>
    <StyledTitle>1 800€</StyledTitle>
    <StyledSubtitle>par mois</StyledSubtitle>
  </StyledBody>
</StatusCard>
```

**Problème** : On se retrouve avec des `StyledXXX` partout, les styles sont éparpillés, et c'est dur de maintenir une cohérence visuelle.

### Option 2 : Props monolithiques

```tsx
<CarteComparaison
  étiquettes={<RégimeTag régime="RG" />}
  contenu="1 800€"
  sousTitre="par mois"
/>
```

**Problème** : Moins flexible, on doit prévoir toutes les props possibles à l'avance, et l'API devient vite énorme.

### Option 3 : Configuration par objet

```tsx
<CarteComparaison
  config={{
    étiquettes: ["RG", "AE"],
    montant: 1800,
    unité: "€/mois"
  }}
/>
```

**Problème** : Trop rigide, on perd la composabilité React, et on ne peut pas mettre de composants custom.

## Quand utiliser ce pattern ?

👍 **À utiliser pour** :
- Composants complexes (cartes de comparaison, formulaires multi-sections)
- Quand on veut offrir de la flexibilité tout en gardant le contrôle
- Pour éviter la multiplication des `StyledXXX`

👎 **À éviter pour** :
- Composants simples (un bouton, un input basique)
- Quand une simple prop suffit

## Exemple concret avec layout contrôlé

```tsx
const CarteComparaison = ({ children, variant = 'vertical' }) => {
  const étiquettes = // ... extraction
  const contenu = // ... extraction

  // Layout horizontal avec Grid
  if (variant === 'horizontal') {
    return (
      <Grid>
        <Column1>{étiquettes}</Column1>
        <Column2>{contenu}</Column2>
      </Grid>
    )
  }

  // Layout vertical avec Flexbox
  return (
    <Flex direction="column">
      {étiquettes}
      {contenu}
    </Flex>
  )
}
```

On garde le contrôle total sur le layout tout en laissant l'utilisateur composer le contenu librement. C'est le meilleur des deux mondes.
