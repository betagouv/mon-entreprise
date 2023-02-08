import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import PageHeader from '@/components/PageHeader'
import { FromBottom } from '@/components/ui/animate'
import Meta from '@/components/utils/Meta'
import { Button } from '@/design-system/buttons'
import { Card } from '@/design-system/card'
import { Grid, Spacing } from '@/design-system/layout'
import { H2 } from '@/design-system/typography/heading'
import { Intro, SmallBody } from '@/design-system/typography/paragraphs'
import { RootState } from '@/reducers/rootReducer'
import { useNextQuestionUrl } from '@/selectors/companyStatusSelectors'
import { useSitePaths } from '@/sitePaths'

import { TrackPage } from '../../../ATInternetTracking'
import { SimulateurCard } from '../../Simulateurs/Home'
import useSimulatorsData from '../../Simulateurs/metadata'
import créerSvg from './créer.svg'

export default function Créer() {
	const { t } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()
	const nextQuestionUrl = useNextQuestionUrl()
	const guideAlreadyStarted = useSelector(
		(state: RootState) =>
			!!Object.keys(state.choixStatutJuridique.companyLegalStatus).length
	)
	const simulateurData = useSimulatorsData()

	return (
		<FromBottom>
			<TrackPage name="accueil" />
			<Meta
				page="créer"
				title={t('créer.titre', 'Créer une entreprise')}
				description="Créer une entreprise"
				ogImage={créerSvg}
			/>

			<PageHeader
				titre={<Trans i18nKey="créer.titre">Créer une entreprise</Trans>}
				picture={créerSvg}
			>
				<Intro>
					<Trans i18nKey="créer.description">
						Avant d'entamer les démarches administratives pour créer votre
						entreprise, vous devez choisir un statut juridique adapté à votre
						activité
					</Trans>
				</Intro>
				<Button
					size="XL"
					to={
						guideAlreadyStarted && nextQuestionUrl
							? nextQuestionUrl
							: absoluteSitePaths.créer.guideStatut.multipleAssociates
					}
				>
					{!guideAlreadyStarted
						? t('créer.cta.default', 'Trouver le bon statut')
						: t('créer.cta.continue', 'Continuer le guide')}
				</Button>
				<SmallBody>
					<Trans i18nKey="créer.warningPL">
						Le cas des professions libérales réglementées n'est pas encore
						traité
					</Trans>
				</SmallBody>
			</PageHeader>
			<Spacing xl />

			<H2 className="sr-only">
				<Trans>Ressources utiles</Trans>
			</H2>

			<Grid container spacing={3} role="list">
				<SimulateurCard
					role="listitem"
					{...simulateurData['coût-création-entreprise']}
				/>
				<SimulateurCard
					role="listitem"
					{...simulateurData['comparaison-statuts']}
				/>
				<Grid item xs={12} sm={6} lg={4} role="listitem">
					<Card
						icon="🚶"
						title={t(
							'créer.ressources.autoEntrepreneur.title',
							'Démarche auto-entrepreneur'
						)}
						to={absoluteSitePaths.créer['auto-entrepreneur']}
						ctaLabel={t(
							'créer.ressources.autoEntrepreneur.cta',
							'Consulter les démarches'
						)}
					>
						<Trans i18nKey="créer.ressources.autoEntrepreneur.body">
							Vous souhaitez devenir auto-entrepreneur ? Découvrez les étapes
							pour bien démarrer votre activité
						</Trans>
					</Card>
				</Grid>
			</Grid>
		</FromBottom>
	)
}
