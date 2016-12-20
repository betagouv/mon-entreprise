import React, { Component } from 'react'
import './About.css'

export default class About extends Component {
	render() {
		return (
			<section id="about">
				<h1>À propos</h1>
				<p>
					Il existe aujourd'hui un certain nombre de simulateurs du système social français. OpenFisca, <em>ouvert</em>, relativement <em>étendu</em>, <em>collaboratif</em> en est un représentant inédit.*
				</p>
				<p>
					OpenFisca permet aujourd'hui de faire des simulations économiques (menant à des rapports de politique publique, ou a des travaux de recherche), et des services publics de type simulateur en ligne. C'est un calculateur numérique avant tout : on lui donne une situation (une famille avec deux parents salariés avec un certain revenu brut et un enfant scolarisé), on lui demande des variables de sortie (ex. le revenu net, le revenu après impôts), on en obtient les résultats sous forme numérique seulement (revenu du ménage après impôts : 3000€).
				</p>

				<p>
					OpenFisca est bâti comme beaucoup de serveurs : du code métier (ex. comment votre cotisation de retraite est calculée), et une API Web pour servir des interfaces. Une particularité cependant : le moteur (<em>OpenFisca Core</em>) est séparé du code métier du pays initial (<em>OpenFisca France</em>), ce qui a permis à d'autres pays de se lancer (pour l'instant, la Tunisie et le Sénégal).
				</p>

				<p>
					Le code métier, comme le moteur d'éxecution, est écrit en Python, un langage très commun, et en Numpy **. Ces choix historiques entraînent trois limitations importantes : 1) seul le moteur d'OpenFisca est capable d'interpréter le code métier, 2) il faut être développeur et se former pour lire ou éditer le code métier et 3) l'objectif est essentiellement de faire des calculs numériques.

				</p>

				<p>
					Tout une gamme d'applications sont compliquées par ces limitations. Un simulateur Web devra lui-même connaître la liste des lignes d'une fiche de paie pour en afficher les valeurs individuelles; il est très difficile d'extraire les calculs de la paie pour en faire une explication pédagogique; le code métier est ouvert mais obscur; les outils d'exploration de la legislation sont très coûteux à construire et maintenir; etc.
				</p>

				<p>
					Une simplification a été faite dans cet exposé : le code métier est aujourd'hui en partie externalisé dans des <em>paramètres</em> contenant les nombres historisés utilisés par les règles de calcul. Par exemple, les valeurs historisées de votre taux de cotisation retraite complémentaire.

					Contrairement au code métier, ces paramètres sont théoriquement de la donnée facilement exploitable par d'autres applications, on peut par exemple les visualiser sous forme de tableaux. Malheureusement, la loi est souvent complexe, et l'on s'en appercevra vite : par exemple, il y a deux retraites complémentaires dans le régime général : pour les cadres et les non-cadres. Il y a donc de la logique <em>passive</em> incrustée dans ces paramètres, exploitée par le code métier pour calculer la bonne valeur de votre cotisation retraite.
				</p>
				<p>
					L'idée de ce projet est de prendre clairement parti, <b>en inscrivant toute la logique métier sous forme passive dans de la donnée.</b> Différents moteurs d'éxécution pourront exploiter cette donnée pour construire les applications aujourd'hui manquantes. Il faut donc constuire une nouvelle syntaxe, un format de données assez expressif pour être lisible et agréable à écrire (car il faudra tout réécrire à la main !), et interprétable par un programme.

				</p>
				<p>
					<b>Ce site présente une première version de cette syntaxe.</b> Elle est <em>très expérimentale</em>, mais décrit déjà une bonne partie du droit commun en matière de prélèvements sociaux sur les salaires. En soi, sans éxécution, c'est déjà un outil de travail intéressant pour décrire la loi.
				</p>

				<p id="notes">
					* il couvre notamment les 3 grands domaines impôts sur le revenu, prestations sociales et prélèvements sur les salaires. Ceci grâce au travail de l'Insitut des Politiques Publiques, d'Etalab et de l'Incubateur des Services numériques, services de l'Ètat, ainsi qu'un certain nombre d'autres acteurs.
				<br/><br/>
					** Numpy est une brique logicielle permettant, pour simplifier, au moteur de simuler des populations entières sans perte de performance. Eh oui, les processeurs qui font tourner nos ordinateurs et smartphones sont souvent mal exploités !
				</p>
			</section>
		)
	}
}
