import { FromBottom } from 'Components/ui/animate'
import Emoji from 'Components/utils/Emoji'
import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Radio, RadioGroup } from 'DesignSystem/field'
import { H1, H2, H3 } from 'DesignSystem/typography/heading'
import { Body, SmallBody } from 'DesignSystem/typography/paragraphs'
import { formatValue } from 'publicodes'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Redirect } from 'react-router-dom'
import { TrackPage } from '../../../ATInternetTracking'
import { selectSeuilRevenus } from './actions'
import { getTranslatedActivité } from './activitésData'
import { ActivitéSelection } from './ActivitésSelection'
import Exonérations from './Exonérations'
import NextButton from './NextButton'
import { estExonéréeSelector } from './selectors'
import { StoreContext } from './StoreContext'

export type Activity = {
	titre: string
	explication: string
}

export default function Activité({
	match: {
		params: { title },
	},
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
			<FromBottom>
				<TrackPage name={activité.titre} />
				<ScrollToTop />
				<H1>{activité.titre}</H1>
				<Body>{activité.explication}</Body>
				<H2>
					<Trans i18nKey="économieCollaborative.activité.choix">
						Quelles sont plus précisément les activités exercées ?
					</Trans>
				</H2>
				<section className="ui__ full-width light-bg">
					<ActivitéSelection
						currentActivité={title}
						activités={activité.activités.map(({ titre }: Activity) => titre)}
					/>
				</section>
			</FromBottom>
		)
	}

	const seuilRevenus = state[title].seuilRevenus
	const estExonérée = estExonéréeSelector(title)(state)
	return (
		<section key={title}>
			<ScrollToTop />
			<FromBottom>
				<TrackPage name={activité.titre} />
				<H1>
					<Emoji emoji={activité.icônes} /> {activité.titre}
				</H1>
				<Markdown>{activité.explication}</Markdown>
				{activité.plateformes && (
					<SmallBody>
						<Emoji emoji={'📱 '} />
						{activité.plateformes.join(', ')}
					</SmallBody>
				)}
				<Exonérations
					activité={title}
					exceptionsExonération={activité['exonérée sauf si']}
					exonération={activité['exonérée si']}
				/>

				{estExonérée ? null : activité['seuil pro'] === 0 ? (
					<Trans i18nKey="économieCollaborative.activité.pro">
						<H2>Il s'agit d'une activité professionnelle</H2>
						<Body>
							Les revenus de cette activité sont considérés comme des{' '}
							<strong>revenus professionnels dès le 1er euro gagné</strong>.
						</Body>
					</Trans>
				) : activité['seuil déclaration'] === 0 && !activité['seuil pro'] ? (
					<Trans i18nKey="économieCollaborative.activité.impôt">
						<H2>Vous devez déclarez vos revenus aux impôts</H2>
						<Body>Les revenus de cette activité sont imposables.</Body>
					</Trans>
				) : (
					<>
						<Trans i18nKey="économieCollaborative.activité.revenusAnnuels">
							<H3 as="h2">Revenus annuels</H3>
							<Body>Vos revenus annuels pour cette activité sont :</Body>
						</Trans>
						<RadioGroup
							onChange={(value) => {
								dispatch(
									selectSeuilRevenus(
										title,
										value as Parameters<typeof selectSeuilRevenus>[1]
									)
								)
							}}
							defaultValue={seuilRevenus}
						>
							{activité['seuil déclaration'] &&
								activité['seuil déclaration'] !== 0 && (
									<Radio value="AUCUN">
										<Trans>inférieurs à</Trans>{' '}
										{formatValue(activité['seuil déclaration'], {
											precision: 0,
											language,
											displayedUnit: '€',
										})}
									</Radio>
								)}
							<Radio value="IMPOSITION">
								<Trans>inférieurs à</Trans>{' '}
								{formatValue(activité['seuil pro'], {
									precision: 0,
									language,
									displayedUnit: '€',
								})}
							</Radio>
							{activité['seuil régime général'] && (
								<Radio value="RÉGIME_GÉNÉRAL_DISPONIBLE">
									{' '}
									<Trans>supérieurs à</Trans>{' '}
									{formatValue(activité['seuil pro'], {
										precision: 0,
										language,
										displayedUnit: '€',
									})}
								</Radio>
							)}

							<Radio value="RÉGIME_GÉNÉRAL_NON_DISPONIBLE">
								{' '}
								<Trans>supérieurs à</Trans>{' '}
								{formatValue(
									activité['seuil régime général'] || activité['seuil pro'],
									{
										precision: 0,
										language,
										displayedUnit: '€',
									}
								)}
							</Radio>
						</RadioGroup>
					</>
				)}
				<NextButton disabled={!seuilRevenus && !estExonérée} activité={title} />
			</FromBottom>
		</section>
	)
}
