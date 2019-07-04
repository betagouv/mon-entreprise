import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import { CheckItem } from 'Ui/Checklist'

export default withSitePaths(function LocationMeublée({ sitePaths }) {
	// TODO les locations saisonières < 760€ d'une partie de la res. princ. sont éxonérés
	const [isRésidencePrincipale, setRésidencePrincipale] = useState(false)
	return (
		<Animate.fromBottom>
			<ScrollToTop />
			<h1>{emoji('🏡')} Location meublée</h1>
			<p>
				Vous avez loué un logement meublé pour de courtes durées à une clientèle
				de passage qui n'y élit pas domicile (hors location de chambres d’hôtes
				et de meublé de tourisme)
			</p>
			<p>
				<em>Exemples de plateforme : AirBnb, Abritel...</em>
			</p>

			<CheckItem
				name="résidencePrincipale"
				title="Il s'agit de ma résidence principale"
				explanations={
					<p>
						Les locations saisonnières d’une ou plusieurs pièces de sa résidence
						principale qui n’excèdent pas 760€ par an sont exonérées et ne sont
						pas à déclarer à l’impôt sur le revenu
					</p>
				}
				onChange={setRésidencePrincipale}
			/>

			<h2>Vos recettes annuelles sont :</h2>
			<ul>
				{isRésidencePrincipale && (
					<li>
						<button className="ui__ simple button">Inférieures à 760 €</button>
					</li>
				)}
				<li>
					<button className="ui__ simple button">
						{isRésidencePrincipale
							? 'Entre 760 € et 23 000 €'
							: 'Inférieures à 23 000 €'}
					</button>
				</li>
				<li>
					<Link
						to={{
							pathname: sitePaths.économieCollaborative.votreSituation,
							search: '?middle'
						}}
						className="ui__ simple button">
						Entre 23 000 € et 70 000 €
					</Link>
				</li>
				<li>
					<button className="ui__ simple button">
						Entre 70 000 € et 82 000 €
					</button>
				</li>
				<li>
					<Link
						to={sitePaths.économieCollaborative.votreSituation}
						className="ui__ simple button">
						Supérieures à 82 000 €
					</Link>
				</li>
			</ul>
		</Animate.fromBottom>
	)
})
