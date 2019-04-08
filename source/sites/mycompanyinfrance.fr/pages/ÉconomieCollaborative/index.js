import { React, emoji } from 'Components'
import { useState } from 'react'
import activités from './activités.yaml'
import { without } from 'ramda'
import classNames from 'classnames'

export default () => {
	let [itemsSelected, selectItem] = useState([])
	return (
		<div css="margin-top: 1em; ">
			<p>
				J'ai des revenus issus des <strong>plateformes en ligne</strong> :
				Airbnb, Abritel, Drivy, Blablacar, Leboncoin, ...
			</p>
			<div css="display: flex; align-items: center ; margin: 0em 0 4em">
				<span
					css={`
						margin-top: 0.6em;
						img {
							width: 2em !important;
							height: 2em !important;
							margin-right: 1em !important;
						}
					`}>
					{emoji('🤔')}
				</span>
				<h1 css="font-size: 200%; ">
					Comment être en règle ? <br />
					Quelles cotisations et impôt ?
				</h1>
			</div>
			<div>
				<p>{emoji('✔️')} Sélectionnez vos revenus :</p>
				<ul
					css={`
					display: flex;
					justify-content: space-evenly;
					flex-wrap: wrap;
					li > * {
						width: 100%;
					}
					li {
						margin: 1em;
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
								className={classNames('ui__ card ', { selected })}
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
								{selected && (
									<div
										css={`
											display: flex;
											align-items: center;
											justify-content: space-evenly;
										`}>
										<input
											onClick={e => e.stopPropagation()}
											css={`
												width: 8em;
												font-size: 100%;
												border: none;
												border-radius: 0.3em;
												padding: 0.3em;
											`}
											placeholder="votre revenu"
										/>
										&nbsp;€
									</div>
								)}
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}
