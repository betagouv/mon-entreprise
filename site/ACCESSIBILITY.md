# Maintenir l'accessibilité de mon-entreprise

## Se former

### Formation express

On pourra parcourir les [notices AcceDe Web](https://www.accede-web.com/) d'_Atalan_, en particulier celles destinées aux dévelopeuses et développeurs :

-   [Intégration HTML et CSS](https://www.accede-web.com/notices/html-et-css/)
-   [Interfaces riches](https://www.accede-web.com/notices/interface-riche/)

Ces notices se lisent en une heure ou deux et, même en les survolant, on apprend beaucoup de choses.

### Formation complète

Pour être deux développeurs à l'avoir suivie (@newick et @logic-fabric), nous pouvons recommander la formation [Développer des sites web accessibles et conformes au RGAA](https://formations.access42.net/formations/formation-developpement-accessible/) d'_Access42_.

## Quelques points de vigilance

La liste de recommandations qui suit est loin d'être exhaustive.

Elle ne mentionne que quelques erreurs relevées lors des derniers audits, de nombreuses bonnes pratiques ayant déjà été appliquées préalablement. 👌

### Concernant les attributs ARIA

-   Toujours privilégier le HTML pur à l'utilisation d'attributs ARIA (cf. [_No ARIA is better than bad ARIA_](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)) : les sites utilisant l'API ARIA sont en moyenne moins accessibles que les autres, celle-ci étant souvent mal utilisée.
-   Pour utiliser correctement les attributs ARIA au sein de composants complexes (et savoir quelles interactions clavier sont nécessaires), se référer aux [patterns ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/).

### Concernant les `aria-label`

-   L`aria-label` d'un composant interactif doit toujours contenir l'intitulé visible, pour être déclenchable avec une commande vocale.
-   Plus un `aria-label` est concis, plus les utilisateurs de lecteur d'écran vous remercieront.
-   Plus on peut se passer d'`aria-label` (comme de tout autre attribut ARIA), mieux c'est.

### Concernant les images

-   Si une image est décorative, mettre un `alt=""` pour qu'elle soit ignorée des lecteurs d'écran.
-   Si une image n'est pas décorative, éviter de préciser "image" ou "logo" dans son alternative textuelle : les lecteurs d'écran vocalisent déjà la nature du composant.

### Concernant les formulaires

-   Toujours associer un `label` à chaque `input` (un placeholder ne suffit pas et n'est pas restitué par un lecteur d'écran).
-   Toujours mettre une liaison `for/id` entre un `input` et son `label`, même lorsqu'ils sont imbriqués.
-   Les groupes de boutons radio ou de checkboxes doivent être contenus dans un `<fieldset>` avec une `<legend>`.

### Concernant les "live regions ARIA"

-   Utiliser un `role="alert/status/log"` plutôt que les attributs `aria-live` et `aria-atomic`, beaucoup moins bien supportés (cf. https://a11ysupport.io).
-   Ne pas créer dynamiquement cette "live region" au moment d'y injecter du contenu : cette "live region" sera plus fiable si elle est présente dans le DOM avant cette injection de contenu.
