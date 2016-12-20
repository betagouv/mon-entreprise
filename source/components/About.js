import React, { Component } from 'react'
import './About.css'

export default class About extends Component {
	render() {
		return (
			<section id="about">
				<h1>À propos</h1>
				<p>
					Il existe aujourd'hui un certain nombre de simulateurs du système social français. OpenFisca, <em>ouvert</em>, relativement <em>étendu</em> et <em>collaboratif</em> en est un représentant inédit.*
				</p>
				<p>
					OpenFisca permet aujourd'hui de faire des simulations économiques (menant à des rapports de politique publique, ou à des travaux de recherche), et des services numériques de type simulateur en ligne. C'est un calculateur numérique avant tout : on lui donne une situation (ex. une famille avec deux parents salariés ayant un certain revenu brut et un enfant scolarisé), on lui demande des variables de sortie (ex. le revenu net, le revenu après impôts), et on en obtient les résultats sous forme numérique seulement (revenu du ménage après impôts : 3000€).
				</p>

				<p>
					OpenFisca est bâti comme le sont beaucoup de serveurs : du code métier (ex. comment votre cotisation de retraite est calculée), et une API Web pour servir des interfaces. Une particularité cependant : le moteur (<em>OpenFisca Core</em>) est séparé du code métier du pays initial (<em>OpenFisca France</em>), ce qui a permis à d'autres pays de se lancer (pour l'instant, la Tunisie et le Sénégal).
				</p>

				<p>
					Le code métier, comme le moteur d'éxecution, est écrit en Python, langage très commun, et en Numpy **. Ces choix historiques entraînent trois limitations importantes :
				</p>
				<ul>
					<li> seul le moteur d'OpenFisca est capable d'interpréter le code métier</li>
					<li> il faut être développeur et se former pour lire ou éditer le code métier</li>
					<li> l'application principale est de faire des calculs numériques.</li>
				</ul>

				<p>
					Le développement de toute une gamme d'applications est fortement compliqué par ces limitations. Un simulateur Web devra lui-même connaître la liste des lignes d'une fiche de paie pour en afficher les valeurs numériques; il est très difficile d'extraire les calculs de la paie pour en faire une explication pédagogique; le code métier est ouvert mais obscur; les outils d'exploration de la législation sont très coûteux à construire et maintenir; etc.
				</p>

				<p>
					Une simplification a été faite dans cet exposé : le code métier est aujourd'hui en partie externalisé dans des <em>paramètres</em> contenant les nombres historisés utilisés par les règles de calcul. Par exemple, les valeurs historisées de votre taux de cotisation de retraite complémentaire, ou ceux du SMIC.

					Contrairement au code métier, ces paramètres sont théoriquement de la donnée facilement exploitable par d'autres applications : on peut par exemple les visualiser sous forme de tableaux. Malheureusement, la loi est souvent complexe, et l'on s'en apercevra vite : par exemple, il y a deux retraites complémentaires dans le régime général : pour les cadres et les non-cadres. Il y a donc de la logique <em>passive</em> incrustée dans ces paramètres, exploitée par le code métier pour pouvoir calculer la bonne valeur de votre cotisation retraite.
				</p>
				<p>
					L'idée de ce projet est de prendre clairement parti, <b>en inscrivant toute la logique métier sous forme passive dans de la donnée</b>. Dans notre exemple, c'est toute la description de la retraite et son calcul (des références législatives, un barème à taux marginal, des exceptions etc.) qui seront inscrits dans une base de règles sous forme d'instructions lisibles. Différents moteurs d'éxécution pourront exploiter cette donnée pour construire les applications aujourd'hui manquantes. Il faut donc définir une nouvelle syntaxe, un format de données assez expressif pour être <em>lisible et agréable à écrire</em> (car il faudra tout réécrire à la main !), ainsi qu'<em>interprétable par un programme</em>.
				</p>
				<p>
					<b>Ce site présente une première version de cette syntaxe.</b> Elle est <em>très expérimentale</em>, mais décrit déjà une bonne partie du droit commun national en matière de prélèvements sociaux sur les salaires. En soi, sans moteur d'éxécution, c'est déjà un outil de travail intéressant pour décrire la loi.
				</p>

				<p id="notes">
					* il couvre notamment les 3 grands domaines impôts sur le revenu, prestations sociales et prélèvements sur les salaires. Ceci grâce au travail de l'Insitut des Politiques Publiques, d'Etalab et de l'Incubateur des Services numériques, services de l'Ètat, ainsi qu'un certain nombre d'autres acteurs.
				<br/><br/>
					** Numpy est une brique logicielle permettant, pour simplifier, au moteur de simuler des populations (millions d'individus) sur nos ordinateurs portables. Eh oui, les processeurs qui font tourner nos ordinateurs et smartphones sont souvent mal exploités !
				</p>
			</section>
		)
	}
}
