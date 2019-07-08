import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import Value from 'Components/Value'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Redirect } from 'react-router-dom'
import Animate from 'Ui/animate'
import { selectSeuilRevenus } from './actions'
import { getActivité } from './activitésData'
import { ActivitéSelection, NextButton } from './ActivitésSelection'
import { StoreContext } from './StoreContext'

export default withSitePaths(function Activité({
	sitePaths,
	match: {
		params: { title }
	}
}) {
	const { state, dispatch } = useContext(StoreContext)
	const activité = getActivité(title)
	if (!(title in state)) {
		return <Redirect to={sitePaths.économieCollaborative.index} />
	}

	if (activité.activités) {
		return (
			<Animate.fromBottom>
				<ScrollToTop />
				<h1>{activité.titre}</h1>
				<p>{activité.explication}</p>
				<p>Quels sont plus précisément les types d'activités exercées ? </p>
				<section className="ui__ full-width choice-group">
					<ActivitéSelection
						currentActivité={title}
						activités={activité.activités.map(({ titre }) => titre)}
					/>
				</section>
			</Animate.fromBottom>
		)
	}

	const seuilRevenus = state[title].déclaration

	return (
		<section>
			<ScrollToTop />
			<Animate.fromBottom>
				<h1>
					{emoji(activité.icônes)} {activité.titre}
				</h1>
				<Markdown source={activité.explication} />
				{activité.plateformes && (
					<p>
						{emoji('📱 ')}
						Exemples de plateformes : {activité.plateformes.join(', ')}
					</p>
				)}

				{activité['seuil pro'] === 0 ? (
					<>
						<h2>Il s'agit d'une activité professionnelle</h2>
						<p>
							Les revenus de cette activité sont considérés comme des{' '}
							<strong>revenus professionnels dès le 1er euro gagné</strong>.
						</p>
					</>
				) : (
					<>
						<h2>Revenus annuels</h2>
						<p>Vos revenus annuels pour cette activité sont :</p>
						<ul
							key={title}
							css="
								list-style: none;
								padding-left: 0;
							"
							onChange={e => {
								dispatch(selectSeuilRevenus(title, e.target.value))
							}}>
							{activité['seuil déclaration'] && (
								<li>
									<label>
										<input
											type="radio"
											name={title + '.seuilRevenus'}
											value="AUCUN"
											defaultChecked={seuilRevenus === 'AUCUN'}
										/>{' '}
										inférieurs à{' '}
										<Value numFractionDigits={0}>
											{activité['seuil déclaration']}
										</Value>
									</label>
								</li>
							)}
							<li>
								<label>
									<input
										type="radio"
										name={title + '.seuilRevenus'}
										value="IMPOSITION"
										defaultChecked={seuilRevenus === 'IMPOSITION'}
									/>{' '}
									inférieurs à{' '}
									<Value numFractionDigits={0}>{activité['seuil pro']}</Value>
								</label>
							</li>
							<li>
								<label>
									<input
										type="radio"
										name={title + '.seuilRevenus'}
										value="PRO"
										defaultChecked={seuilRevenus === 'PRO'}
									/>{' '}
									supérieurs à{' '}
									<Value numFractionDigits={0}>{activité['seuil pro']}</Value>
								</label>
							</li>
							{activité['seuil régime général'] && (
								<li>
									<label>
										<input
											type="radio"
											name={title + '.seuilRevenus'}
											value="RÉGIME_GÉNÉRAL_NON_DISPONIBLE"
											defaultChecked={
												seuilRevenus === 'RÉGIME_GÉNÉRAL_NON_DISPONIBLE'
											}
										/>{' '}
										supérieurs à{' '}
										<Value numFractionDigits={0}>
											{activité['seuil régime général']}
										</Value>
									</label>
								</li>
							)}
						</ul>
					</>
				)}
				<NextButton disabled={!seuilRevenus} />
			</Animate.fromBottom>
		</section>
	)
})
