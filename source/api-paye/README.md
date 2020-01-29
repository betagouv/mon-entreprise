# API Paye [béta]

Nous lançons une expérimentation pour l'utilisation de notre moteur de calcul pour la gestion complète de la paye — et non plus seulement pour une simulation.

Plusieurs évolutions ont déjà été apportées à Publicode dans ce but : mécanisme d'amendement de règle permettant de gérer les cas particuliers, fiabilisation des calculs avec le système d'unités...

Certaines fonctionnalités doivent encore être développées :

- Gestion des arrondis #490
- Régularisation progressive
- Intégration des évolutions temporelles #793
- Interfaçage DSN
- Ventilation de la réduction générale

Par ailleurs le moteur doit montrer sa fiabilité dans un contexte serveur/service (performance, fiabilité, ne pas planter, etc.).
