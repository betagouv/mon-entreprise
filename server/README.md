# Bot Mattermost pour stand-up asynchrone

Ce bot envoie une notification périodique sur un canal Mattermost dédié afin que chaque membre de l'équipe puisse écrire en réponse où il en est dans ses tâches.

Il désigne également qui sera l'animateur pour chaque jour de la semaine à venir.

Et peut-être plus à venir...

# Détail technique

Le bot peut être installé facilement sur Scalingo, vous pouvez aller voir le `Procfile` à la racine du projet.
Il nécessite une base de données Mongodb pour stocker les token d'authentification et la liste des animateurs de la semaine.
