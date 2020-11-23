import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import Value from 'Components/EngineValue'
import { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { Redirect } from 'react-router-dom'
import Animate from 'Components/ui/animate'
import { selectSeuilRevenus } from './actions'
import { getTranslatedActivité } from './activitésData'
import { ActivitéSelection } from './ActivitésSelection'
import ExceptionsExonération from './ExceptionsExonération'
import NextButton from './NextButton'
import { estExonéréeSelector } from './selectors'
import { StoreContext } from './StoreContext'
import { formatValue } from 'publicodes'

export type Activity = {
	titre: string
	explication: string
}

export default function Activité({
	match: {
		params: { title }
	}
}: any) {
	const { language } = useTranslation().i18n
	const sitePaths = useContext(SitePathsContext)
	const { state, dispatch } = useContext(StoreContext)
	const activité = getTranslatedActivité(title, language)
	if (!(title in state)) {
		return <Redirect to={sitePaths.simulateurs.économieCollaborative.index} />
	}

	if (activité.activités) {
		return (
			<Animate.fromBottom>
				<ScrollToTop />
				<h1>{activité.titre}</h1>
				<p>{activité.explication}</p>
				<p>
					<Trans i18nKey="économieCollaborative.activité.choix">
						Quelles sont plus précisément les activités exercées ?
					</Trans>
				</p>
				<section className="ui__ full-width light-bg">
					<ActivitéSelection
						currentActivité={title}
						activités={activité.activités.map(({ titre }: Activity) => titre)}
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
					<Trans i18nKey="économieCollaborative.activité.pro">
						<h2>Il s'agit d'une activité professionnelle</h2>
						<p>
							Les revenus de cette activité sont considérés comme des{' '}
							<strong>revenus professionnels dès le 1er euro gagné</strong>.
						</p>
					</Trans>
				) : activité['seuil déclaration'] === 0 && !activité['seuil pro'] ? (
					<Trans i18nKey="économieCollaborative.activité.impôt">
						<h2>Vous devez déclarez vos revenus aux impôts</h2>
						<p>Les revenus de cette activité sont imposables.</p>
					</Trans>
				) : (
					<>
						<Trans i18nKey="économieCollaborative.activité.revenusAnnuels">
							<h2>Revenus annuels</h2>
							<p>Vos revenus annuels pour cette activité sont :</p>
						</Trans>
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
											<Trans>inférieurs à</Trans>{' '}
											{formatValue(activité['seuil déclaration'], {
												precision: 0,
												language,
												displayedUnit: '€'
											})}
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
									<Trans>inférieurs à</Trans>{' '}
									{formatValue(activité['seuil pro'], {
										precision: 0,
										language,
										displayedUnit: '€'
									})}
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
										<Trans>supérieurs à</Trans>{' '}
										{formatValue(activité['seuil pro'], {
											precision: 0,
											language,
											displayedUnit: '€'
										})}
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
									<Trans>supérieurs à</Trans>{' '}
									{formatValue(
										activité['seuil régime général'] || activité['seuil pro'],
										{
											precision: 0,
											language,
											displayedUnit: '€'
										}
									)}
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
