# Traitement des tables de référence du Guichet Unique

Guichet unique défini sa propre nomenclature d’activité, différente de la Naf de l’INSEE, pour des raisons pas forcément très justifiées (selon l’auteur de ces lignes). On a donc deux codes pour une même entreprise, attribuées par des acteurs séparés, ce qui peut aboutir à incompatibilité et de nombreux problèmes de mise à jour. 

Par conséquSent, nous avons choisi de nous appuyer en premier sur la classification Insee sur les assistants mon-entreprise. En effet, cette dernière a l’avantage d’être bien documentée et très connue des usagers et usagères. C’est une fois le code NAF renseigné que nous demandons éventuellement des précisions, afin de déterminer la classification du guichet unique parmis celles compatibles. 

Ce dossier contient ainsi les scripts qui transforment et traitent les données issues du fichier de référence NomenclatureGuichet pour l’utilisation dans les assistants de mon-entreprise. 

## D’où vient le fichier NomenclatureGuichet ? 

Le fichier est mis à jour par les responsables de Guichet unique. On peut le trouver sur Resana. Il est possible de demander à l’Urssaf l’accès à ce fichier. 


## Quels traitements sont effectués ?

- Ajout de tags présents dans GuichetUnique pour améliorer la recherche de code APE (fichier `ape_tags.json`)
- Création de la table de liaison entre code APE et code Guichet (fichier `ape_to_guichet.json`)
- Extraction des informations pertinentes sur l’activité (imposition, affiliation, nature d’activité, micro-entreprise possible) dans le fichier `activites_guichet.json`

### Prétraitement

À noter : le CSV original étant particulièrement à l’arrache, nous devons effectuer quelques étapes de pré-traitement manuel pour que le script `convert` fonctionne : 

- Ajout du header `Métiers d’art` juste après `Encodage ACOSS` : en effet, seule les headers de la seconde ligne du fichier sont utilisés.
