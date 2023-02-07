import { formatValue } from 'publicodes'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Navigate, useParams } from 'react-router-dom'

import { TrackPage } from '@/ATInternetTracking'
import { FromBottom } from '@/components/ui/animate'
import { ScrollToTop } from '@/components/utils/Scroll'
import { Markdown } from '@/components/utils/markdown'
import { Emoji } from '@/design-system/emoji'
import { Radio, RadioGroup } from '@/design-system/field'
import { H1, H2, H3 } from '@/design-system/typography/heading'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'
import { getValueFrom } from '@/utils'

import { ActivitéSelection } from './ActivitésSelection'
import Exonérations from './Exonérations'
import NextButton from './NextButton'
import { StoreContext } from './StoreContext'
import { selectSeuilRevenus } from './actions'
import { getTranslatedActivité } from './activitésData'
import { estExonéréeSelector } from './selectors'

export type Activity = {
	titre: string
	explication: string
}

export default function Activité() {
	const { title = '' } = useParams()
	const { language } = useTranslation().i18n
	const { absoluteSitePaths } = useSitePaths()
	const { state, dispatch } = useContext(StoreContext)
	const activité = getTranslatedActivité(title, language)
	if (state && !(title in state)) {
		return (
			<Navigate
				to={absoluteSitePaths.simulateurs.économieCollaborative.index}
			/>
		)
	}

	if (getValueFrom(activité, 'activités')) {
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
						activités={(getValueFrom(activité, 'activités') ?? []).map(
							({ titre }: Activity) => titre
						)}
					/>
				</section>
			</FromBottom>
		)
	}

	const seuilRevenus = state?.[title].seuilRevenus ?? undefined
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
					exceptionsExonération={getValueFrom(activité, 'exonérée sauf si')}
					exonération={getValueFrom(activité, 'exonérée si')}
				/>

				{estExonérée ? null : getValueFrom(activité, 'seuil pro') === 0 ? (
					<Trans i18nKey="économieCollaborative.activité.pro">
						<H2>Il s'agit d'une activité professionnelle</H2>
						<Body>
							Les revenus de cette activité sont considérés comme des{' '}
							<strong>revenus professionnels dès le 1er euro gagné</strong>.
						</Body>
					</Trans>
				) : getValueFrom(activité, 'seuil déclaration') === 0 &&
				  !getValueFrom(activité, 'seuil pro') ? (
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
								dispatch?.(
									selectSeuilRevenus(
										title,
										value as Parameters<typeof selectSeuilRevenus>[1]
									)
								)
							}}
							defaultValue={seuilRevenus}
						>
							{getValueFrom(activité, 'seuil déclaration') !== 0 && (
								<Radio value="AUCUN">
									<Trans>inférieurs à</Trans>{' '}
									{formatValue(getValueFrom(activité, 'seuil déclaration'), {
										precision: 0,
										language,
										displayedUnit: '€',
									})}
								</Radio>
							)}
							<Radio value="IMPOSITION">
								<Trans>inférieurs à</Trans>{' '}
								{formatValue(getValueFrom(activité, 'seuil pro'), {
									precision: 0,
									language,
									displayedUnit: '€',
								})}
							</Radio>
							{getValueFrom(activité, 'seuil régime général') && (
								<Radio value="RÉGIME_GÉNÉRAL_DISPONIBLE">
									{' '}
									<Trans>supérieurs à</Trans>{' '}
									{formatValue(getValueFrom(activité, 'seuil pro'), {
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
									getValueFrom(activité, 'seuil régime général') ||
										getValueFrom(activité, 'seuil pro'),
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
