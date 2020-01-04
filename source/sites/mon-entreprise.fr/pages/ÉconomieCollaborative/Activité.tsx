import { T } from 'Components'
import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import Value from 'Components/Value'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router-dom'
import Animate from 'Ui/animate'
import { selectSeuilRevenus } from './actions'
import { getTranslatedActivité } from './activitésData'
import { ActivitéSelection } from './ActivitésSelection'
import ExceptionsExonération from './ExceptionsExonération'
import NextButton from './NextButton'
import { estExonéréeSelector } from './selectors'
import { StoreContext } from './StoreContext'

export default function Activité({
	match: {
		params: { title }
	}
}) {
	const { language } = useTranslation().i18n
	const sitePaths = useContext(SitePathsContext)
	const { state, dispatch } = useContext(StoreContext)
	const activité = getTranslatedActivité(title, language)
	if (!(title in state)) {
		return <Redirect to={sitePaths.économieCollaborative.index} />
	}

	if (activité.activités) {
		return (
			<Animate.fromBottom>
				<ScrollToTop />
				<h1>{activité.titre}</h1>
				<p>{activité.explication}</p>
				<p>
					<T k="économieCollaborative.activité.choix">
						Quelles sont plus précisément les activités exercées ?
					</T>
				</p>
				<section className="ui__ full-width light-bg">
					<ActivitéSelection
						currentActivité={title}
						activités={activité.activités.map(({ titre }) => titre)}
					/>
				</section>
			</Animate.fromBottom>
		)
	}

	const seuilRevenus = state[title].seuilRevenus
	const estExonérée = estExonéréeSelector(title)(state)
	return (
		<section key={title}>
			<ScrollToTop />
			<Animate.fromBottom>
				<h1>
					{emoji(activité.icônes)} {activité.titre}
				</h1>
				<Markdown source={activité.explication} />
				{activité.plateformes && (
					<p className="ui__ notice">
						{emoji('📱 ')}
						{activité.plateformes.join(', ')}
					</p>
				)}
				<ExceptionsExonération
					activité={title}
					exceptionsExonération={activité['exonérée sauf si']}
				/>

				{estExonérée ? null : activité['seuil pro'] === 0 ? (
					<T k="économieCollaborative.activité.pro">
						<h2>Il s'agit d'une activité professionnelle</h2>
						<p>
							Les revenus de cette activité sont considérés comme des{' '}
							<strong>revenus professionnels dès le 1er euro gagné</strong>.
						</p>
					</T>
				) : activité['seuil déclaration'] === 0 && !activité['seuil pro'] ? (
					<T k="économieCollaborative.activité.impôt">
						<h2>Vous devez déclarez vos revenus aux impôts</h2>
						<p>Les revenus de cette activité sont imposables.</p>
					</T>
				) : (
					<>
						<T k="économieCollaborative.activité.revenusAnnuels">
							<h2>Revenus annuels</h2>
							<p>Vos revenus annuels pour cette activité sont :</p>
						</T>
						<ul
							key={title}
							css="
								list-style: none;
								padding-left: 0;
							"
							onChange={(e: any) => {
								dispatch(selectSeuilRevenus(title, e.target.value))
							}}
						>
							{activité['seuil déclaration'] &&
								activité['seuil déclaration'] !== 0 && (
									<li>
										<label>
											<input
												type="radio"
												name={title + '.seuilRevenus'}
												value="AUCUN"
												defaultChecked={seuilRevenus === 'AUCUN'}
											/>{' '}
											<T>inférieurs à</T>{' '}
											<Value maximumFractionDigits={0} unit="€">
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
									<T>inférieurs à</T>{' '}
									<Value maximumFractionDigits={0} unit="€">
										{activité['seuil pro']}
									</Value>
								</label>
							</li>
							{activité['seuil régime général'] && (
								<li>
									<label>
										<input
											type="radio"
											name={title + '.seuilRevenus'}
											value="RÉGIME_GÉNÉRAL_DISPONIBLE"
											defaultChecked={
												seuilRevenus === 'RÉGIME_GÉNÉRAL_DISPONIBLE'
											}
										/>{' '}
										<T>supérieurs à</T>{' '}
										<Value maximumFractionDigits={0} unit="€">
											{activité['seuil pro']}
										</Value>
									</label>
								</li>
							)}

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
									<T>supérieurs à</T>{' '}
									<Value maximumFractionDigits={0} unit="€">
										{activité['seuil régime général'] || activité['seuil pro']}
									</Value>
								</label>
							</li>
						</ul>
					</>
				)}
				<NextButton disabled={!seuilRevenus} activité={title} />
			</Animate.fromBottom>
		</section>
	)
}
