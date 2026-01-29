# Maintenir l'accessibilité de mon-entreprise

## Se former

### Formation express

On pourra parcourir les [notices AcceDe Web](https://www.accede-web.com/) d'_Atalan_, en particulier celles destinées aux dévelopeuses et développeurs :

-   [Intégration HTML et CSS](https://www.accede-web.com/notices/html-et-css/)
-   [Interfaces riches](https://www.accede-web.com/notices/interface-riche/)

Ces notices se lisent en une heure ou deux et, même en les survolant, on apprend beaucoup de choses.

### Formation complète

Pour être deux développeurs à l'avoir suivie (@newick et @logic-fabric), nous pouvons recommander la formation [Développer des sites web accessibles et conformes au RGAA](https://formations.access42.net/formations/formation-developpement-accessible/) d'_Access42_.

## Points de vigilance

Cette liste de recommandations est issue des audits RGAA et des corrections apportées par @newick et @logic-fabric.

### Concernant les attributs ARIA

-   Toujours privilégier le HTML pur à l'utilisation d'attributs ARIA (cf. [_No ARIA is better than bad ARIA_](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)) : les sites utilisant l'API ARIA sont en moyenne moins accessibles que les autres, celle-ci étant souvent mal utilisée.
-   Pour utiliser correctement les attributs ARIA au sein de composants complexes (et savoir quelles interactions clavier sont nécessaires), se référer aux [patterns ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/).
-   Ne pas contrarier le rôle natif d'une balise : utiliser la bonne balise plutôt qu'ajouter un `role` (ex: `<fieldset>` a déjà le rôle `group`, `<button>` a déjà le rôle `button`). En corollaire, éviter de mettre un `role="link"` sur un `<button>` ou un `role="button"` sur un `<a>`.
-   Les hooks et composants de React Aria gèrent correctement les attributs ARIA : les utiliser plutôt que de gérer manuellement ces attributs.

### Concernant les `aria-label`

-   L'`aria-label` d'un composant interactif doit toujours contenir l'intitulé visible, pour être déclenchable avec une commande vocale.
-   Plus un `aria-label` est concis, plus les utilisateurs de lecteur d'écran vous remercieront.
-   Plus on peut se passer d'`aria-label` (comme de tout autre attribut ARIA), mieux c'est.
-   Ne pas combiner `aria-label` et `aria-labelledby` : c'est redondant.
-   Préférer un vrai `<label>` avec `htmlFor` plutôt qu'un `aria-label` quand c'est possible.
-   On peut combiner `aria-label` avec un `<label>` HTML pour préciser le contexte (ex: `aria-label="Envoyer mon signalement"` sur un bouton "Envoyer").
-   On peut utiliser `title` pour afficher une infobulle, mais `title` n'est pas bien interprété par tous les lecteurs d'écran : il est plus sûr d'ajouter aussi un `aria-label`.

### Concernant les images et emojis

-   Si une image est décorative, mettre un `alt=""` pour qu'elle soit ignorée des lecteurs d'écran.
-   Si une image n'est pas décorative, éviter de préciser "image" ou "logo" dans son alternative textuelle : les lecteurs d'écran vocalisent déjà la nature du composant.
-   Les emojis utilisés comme icônes significatives doivent avoir une alternative textuelle (via `aria-label` ou texte caché `.sr-only`).

### Concernant les formulaires

-   Toujours associer un `label` à chaque `input` (un placeholder ne suffit pas et n'est pas restitué par un lecteur d'écran).
-   Toujours mettre une liaison `for/id` entre un `input` et son `label`, même lorsqu'ils sont imbriqués.
-   Les groupes de boutons radio ou de checkboxes doivent être contenus dans un `<fieldset>` avec une `<legend>`.
-   Pour les champs simples (texte, nombre, date), utiliser `<label>` avec `htmlFor`. Réserver `<fieldset>/<legend>` aux groupes de contrôles.
-   Indiquer le format de saisie attendu dans le label (ex: "Date de naissance au format JJ/MM/AAAA").

### Concernant les liens

-   Les liens qui ouvrent une nouvelle fenêtre doivent l'indiquer dans leur aria-label ou leur intitulé visible (ex: "GitHub, nouvelle fenêtre").
-   Les liens doivent être explicites : éviter "En savoir plus" seul. Préférer "En savoir plus sur le statut SASU" ou utiliser un `aria-label` contextuel.

### Concernant les contrastes et couleurs

-   Assurer un contraste suffisant entre le texte et son arrière-plan : au minimum 4,5:1 pour le corps de texte et 3:1 pour les titres (vérifier avec le [Contrast Checker de WebAIM](https://webaim.org/resources/contrastchecker/)).
-   Assurer un contraste suffisant entre les éléments interactifs (bouton, champs de formulaire, ...) et leur arrière-plan : au minimum 3:1. Les bordures doivent aussi avoir un contraste suffisant (cf. [Contrast Finder de Tanaguru](https://contrast-finder.tanaguru.com/) pour trouver des couleurs proches mais suffisamment contrastées).
-   Ne jamais indiquer une information uniquement par la couleur (ex: la page courante doit avoir un autre indicateur visuel en plus de la couleur).

### Concernant la structure HTML

-   Utiliser le HTML sémantique : `<ul>/<ol>/<li>` pour les listes, `<nav>` pour la navigation.
-   Préférer `<ul>/<li>` à `role="list"/role="listitem"`.
-   Respecter la hiérarchie des titres (ex: ne pas utiliser un `<h4>` à la suite d'un `<h2>`). Ressource utile : le [plugin HeadingsMap](https://addons.mozilla.org/fr/firefox/addon/headingsmap/).
-   Ne pas imbriquer d'éléments de titre (`<h3>`, etc.) dans des boutons ou liens d'accordion : utiliser des `<span>` stylisés à la place.
-   Le titre d'une modale doit généralement être un `<h1>` car la modale devient le contexte principal lors de son affichage.

### Concernant les tableaux

-   Tous les tableaux de données doivent avoir un `<caption>` pour les décrire.
-   Utiliser `<th scope="col">` pour les en-têtes de colonnes et `<th scope="row">` pour les en-têtes de lignes.

### Concernant le focus et la navigation clavier

-   Tous les éléments interactifs doivent être accessibles au clavier et avoir un indicateur de focus visible.
-   Les styles de focus et de hover doivent être similaires (recommandation WAI).
-   Ajouter un `tabindex="-1"` pour pouvoir donner le focus avec JS (via `.focus()`) à un élément qui ne le prend pas naturellement.

### Concernant les modales et overlays

-   Implémenter le [pattern Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) complet (attributs ARIA, touche Échap, focus trap). Utiliser le composant Modal de `react-aria-components`.

### Concernant les "live regions ARIA"

-   Utiliser un `role="alert/status/log"` plutôt que les attributs `aria-live` et `aria-atomic`, beaucoup moins bien supportés (cf. https://a11ysupport.io).
-   Ne pas créer dynamiquement cette "live region" au moment d'y injecter du contenu : cette "live region" sera plus fiable si elle est présente dans le DOM avant cette injection de contenu.

### Concernant les nombres

-   Pour les valeurs numériques avec espaces comme séparateurs de milliers (ex: "1 234 €"), supprimer les espaces dans l'`aria-label` pour que les lecteurs d'écran les lisent correctement comme un nombre unique.

### Concernant les unités CSS

-   Utiliser `rem` au lieu de `px` pour les tailles de police (permet le respect du paramètre "Taille de police" du navigateur).
-   Préférer `%` à `rem` pour le positionnement fixe (meilleur support du zoom à 200%).

## Patterns ARIA APG couramment utilisés

Pour les composants complexes, se référer aux patterns officiels du W3C :

### Pattern Dialog (Modale)

```jsx
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h1 id="dialog-title">Titre de la modale</h1>
  {/* Contenu */}
</div>
```

### Pattern Disclosure (Afficher/Masquer)

```jsx
<button aria-expanded="false" aria-controls="panel-id">
  Afficher les détails
</button>
<div id="panel-id" hidden>
  {/* Contenu masqué */}
</div>
```

### Pattern Combobox (Autocomplete)

```jsx
<input
  role="combobox"
  aria-controls="listbox-id"
  aria-expanded="true"
  aria-activedescendant="option-2"
  aria-autocomplete="list"
/>
<ul id="listbox-id" role="listbox">
  <li id="option-1" role="option">Option 1</li>
  <li id="option-2" role="option" aria-selected="true">Option 2</li>
</ul>
```

## Ressources

-   [Patterns ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/) - Référence officielle pour les composants complexes
-   [a11ysupport.io](https://a11ysupport.io) - Support des fonctionnalités ARIA par les lecteurs d'écran
-   [RGAA](https://accessibilite.numerique.gouv.fr/) - Référentiel Général d'Amélioration de l'Accessibilité
-   [WCAG 2.1](https://www.w3.org/TR/WCAG21/) - Web Content Accessibility Guidelines
