import classnames from 'classnames'
import withSitePaths from 'Components/utils/withSitePaths'
import { without } from 'ramda'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import activités from './activités.yaml'
export default withSitePaths(function ActivitésSelection({ sitePaths }) {
	let [itemsSelected, selectItem] = useState([])

	return (
		<Animate.fromBottom>
			<h1>Quels types de revenus avez-vous ?</h1>
			<p>
				Les seuils de déclaration ne sont pas les mêmes en fonction du type
				d'activité que vous exercez. Sélectionnez toutes les plateformes depuis
				lesquelles vous avez reçu de l'argent durant l'année.
			</p>
			<ul
				css={`
					display: flex;
					justify-content: space-evenly;
					flex-wrap: wrap;
					li > * {
						width: 100%;
					}
					li {
						margin: 1rem 0;
						cursor: pointer;
						text-align: center
						width: 12em;
						.title {
							font-weight: 500;
						}
						img {
							width: 2em !important;
							height: 2em !important;
							margin: 0.6em 0 !important;
						}
						p {
							font-size: 95%;
							font-style: italic;
							text-align: center;
							line-height: 1em;
						}
					}
					li:hover, li.selected {background: var(--colour); color: white}
				`}>
				{activités.map(({ titre, exemples, icônes }) => {
					let selected = itemsSelected.includes(titre)
					return (
						<li
							className={classnames('ui__ card ', { selected })}
							key={titre}
							onClick={() =>
								selectItem(
									selected
										? without([titre], itemsSelected)
										: [...itemsSelected, titre]
								)
							}>
							<div className="title">{titre}</div>
							{emoji(icônes)}
							<p>{exemples}</p>
						</li>
					)
				})}
			</ul>
			<p css="text-align: right">
				<Link
					to={sitePaths.économieCollaborative.activités.coConsommation}
					className={classnames('ui__ plain button', {
						disabled: !itemsSelected.length
					})}>
					Continuer
				</Link>
			</p>
		</Animate.fromBottom>
	)
})
