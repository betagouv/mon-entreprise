# Server : serveur back-end de Mon-Entreprise

Serveur hébergé sur Scalingo, utilisé pour faire tourner le bot Stand-up ainsi que pour mettre à disposition des fonctions back-end Node.js.

## Jobs
### Bot Mattermost pour stand-up asynchrone

Ce bot envoie une notification périodique sur un canal Mattermost dédié afin que chaque membre de l'équipe puisse écrire en réponse où il en est dans ses tâches.

Il désigne également qui sera l'animateur pour chaque jour de la semaine à venir.

Et peut-être plus à venir...

#### Détail technique

Le bot peut être installé facilement sur Scalingo, vous pouvez aller voir le `Procfile` à la racine du projet.
Il nécessite une base de données Mongodb pour stocker les token d'authentification et la liste des animateurs de la semaine.

## Functions

### Send Crisp message

Cette fonction utilise l'API Crisp pour rediriger les messages en provenance de notre formulaire de suggestions vers la messagerie Crisp afin de prendre en charge ces retours.
