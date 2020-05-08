import React from 'react'

export default function Personas() {
	return (
		<>
			<h1>Nos personas</h1>

			<div className="ui__ card" css="margin-bottom: 2rem">
				<h2>Jules 38 ans, Marseille</h2>
				<p>
					<em>
						Après 15 ans dans un salon de coiffure, souhaite devenir coiffeur à
						domicile sur treatwell
					</em>
				</p>

				<ul>
					<li>
						<strong>Étape :</strong> Création de statut
					</li>
					<li>
						<strong>Niveau de connaissances en création d’entreprise : </strong>{' '}
						Débutant
					</li>
					<li>
						<strong>Taille de société :</strong> Seul
					</li>
					<li>
						<strong>Spécificités :</strong> Peu de risques/ Besoin d’un statut
						simple et rapide / Mobile
					</li>
				</ul>
			</div>

			<div className="ui__ card" css="margin-bottom: 2rem">
				<h2>Rania, 33 ans, Saint-Etienne</h2>
				<p>
					<em>Aimerait créer une startup d’équipement sportif féminin</em>
				</p>

				<ul>
					<li>
						<strong>Étape :</strong> Idée
					</li>
					<li>
						<strong>Niveau de connaissances en création d'entreprise :</strong>{' '}
						Débutante mais bénéficie d'accompagnement
					</li>
					<li>
						<strong>Taille de société :</strong> 1 associé et 2 ou 3 personnes
					</li>
					<li>
						<strong>Spécificités :</strong> Risque élevé / Besoin d’aides et de
						financements / Besoin de conseil sur les cotisations / Mobile &
						desktop
					</li>
				</ul>
			</div>
			<div className="ui__ card" css="margin-bottom: 2rem">
				<h2>Paul, 40 ans, Pau</h2>
				<p>
					<em>
						Directeur d’une agence de voyage en Asie, a besoin d’informations
						sur la gestion de son entreprise
					</em>
				</p>

				<ul>
					<li>
						<strong>Étape :</strong> société existante
					</li>
					<li>
						<strong>Niveau de connaissances en création d'entreprise :</strong>{' '}
						Confirmé
					</li>
					<li>
						<strong>Taille de société :</strong> 8 personnes
					</li>
					<li>
						<strong>Spécificités :</strong>
						Desktop
					</li>
				</ul>
			</div>
			<div className="ui__ card" css="margin-bottom: 2rem">
				<h2>Valérie, 50 ans, Niort / Aidant</h2>
				<p>
					<em>
						Conseille pôle emploi, accompagne plusieurs bénéficiaires dans la
						création de leur activité
					</em>
				</p>

				<ul>
					<li>
						<strong>Étape :</strong> Conseil
					</li>
					<li>
						<strong>Niveau de connaissances en création d'entreprise :</strong>{' '}
						Débutant
					</li>
					<li>
						<strong>Spécificités :</strong>
						Besoin d’outils rapides et de conseils personnalisés / Desktop
					</li>
				</ul>
			</div>

			<h1>Et les usages que nous avons identifiés</h1>
			<ul>
				<li>
					<strong>Type d’entreprise :</strong> Airbnb vs Freelance vs Startup &
					investissement (& risques)
				</li>
				<li>
					<strong>Etat d’avancement du projet :</strong> j’ai une idée ou je
					veux choisir un statut / J’ai déjà une boite / J'accompagne des
					créateurs
				</li>
				<li>
					<strong>Niveau de connaissance :</strong> débutant vs j’ai déjà monté
					des boites, j’ai accès à un conseil
				</li>
				<li>
					<strong>Age :</strong> jeune et besoin de capitaliser sur l’avenir ou
					proche de la retraite et besoin de pragmatisme.
				</li>
				<li>
					<strong>Type de plateforme</strong> : mobile vs desktop
				</li>
			</ul>
		</>
	)
}
