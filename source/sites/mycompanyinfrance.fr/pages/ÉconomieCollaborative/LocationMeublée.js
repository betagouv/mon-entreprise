import withSitePaths from 'Components/utils/withSitePaths'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'

export default withSitePaths(function LocationMeublée({ sitePaths }) {
	return (
		<>
			<h1>{emoji('🏡')} Location meublée</h1>
			<p>
				Vous avez loué un logement meublé pour de courtes durées à une clientèle
				de passage qui n'y élit pas domicile (hors location de chambres d’hôtes
				et de meublé de tourisme)
			</p>
			<p>Vos recettes annuelles sont :</p>
			<ul>
				<li>
					<Link
						to={sitePaths.économieCollaborative.activités.coConsommation}
						className="ui__ simple button">
						Inférieures à 23 000€
					</Link>
				</li>
				<li>
					<Link
						to={sitePaths.économieCollaborative.activités.coConsommation}
						className="ui__ simple button">
						Situées entre 23 000€ et 70 000€
					</Link>
				</li>
				<li>
					<Link
						to={sitePaths.économieCollaborative.activités.coConsommation}
						className="ui__ simple button">
						Supérieures à 70 000€
					</Link>
				</li>
			</ul>
		</>
	)
})
