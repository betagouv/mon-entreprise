import { Condition } from '@/components/EngineValue'
import { useEngine } from '@/components/utils/EngineContext'
import { Grid } from '@/design-system/layout'
import { H2 } from '@/design-system/typography/heading'
import { FAQAutoEntrepreneurArticle } from '@/pages/Creer/CreationChecklist'
import { GuideURSSAFCard } from '@/pages/Simulateurs/cards/GuideURSSAFCard'
import { IframeIntegrationCard } from '@/pages/Simulateurs/cards/IframeIntegrationCard'
import { SimulatorRessourceCard } from '@/pages/Simulateurs/cards/SimulatorRessourceCard'
import { ExtractFromSimuData } from '@/pages/Simulateurs/metadata'
import { useSitePaths } from '@/sitePaths'
import { Trans, useTranslation } from 'react-i18next'

interface NextStepsProps {
	iframePath: ExtractFromSimuData<'iframePath'>
	nextSteps: ExtractFromSimuData<'nextSteps'>
}

export function NextSteps({ iframePath, nextSteps }: NextStepsProps) {
	const { absoluteSitePaths } = useSitePaths()
	const { language } = useTranslation().i18n
	const engine = useEngine()

	const guideUrssaf = guidesUrssaf.find(
		({ associatedRule }) => engine.evaluate(associatedRule).nodeValue
	)

	if (!iframePath && !nextSteps && !guideUrssaf) {
		return null
	}

	return (
		<section className="print-hidden">
			<H2>
				<Trans>Ressources utiles</Trans>
			</H2>
			<Grid container spacing={3}>
				<Condition expression="dirigeant . auto-entrepreneur">
					<Grid item xs={12} sm={6} lg={4}>
						<FAQAutoEntrepreneurArticle />
					</Grid>
				</Condition>

				{guideUrssaf && language === 'fr' && (
					<Grid item xs={12} sm={6} lg={4}>
						<GuideURSSAFCard guideUrssaf={guideUrssaf} />
					</Grid>
				)}

				{nextSteps?.map((simulatorId) => (
					<Grid item xs={12} sm={6} lg={4} key={simulatorId}>
						<SimulatorRessourceCard simulatorId={simulatorId} />
					</Grid>
				))}

				{iframePath && (
					<Grid item xs={12} sm={6} lg={4}>
						<IframeIntegrationCard
							iframePath={iframePath}
							sitePaths={absoluteSitePaths}
						/>
					</Grid>
				)}
			</Grid>
		</section>
	)
}

const guidesUrssaf = [
	{
		url: 'https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/PAM/Diaporama_Medecins.pdf',
		associatedRule: "dirigeant . indépendant . PL . métier = 'santé . médecin'",
		title: 'Guide Urssaf pour les médecins libéraux',
	},
	{
		url: 'https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/Diaporama_PL_statuts_hors_AE_et_PAM.pdf',
		associatedRule: 'entreprise . activité . libérale réglementée',
		title: 'Guide Urssaf pour les professions libérales réglementées',
	},
	{
		url: 'https://www.autoentrepreneur.urssaf.fr/portail/files/Guides/Metropole/UrssafAutoEntrepreneurMetro.pdf',
		associatedRule: 'dirigeant . auto-entrepreneur',
		title: 'Guide Urssaf pour les auto-entrepreneurs',
	},
	{
		url: 'https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/Diaporama_TI_statuts_hors_AE.pdf',
		associatedRule: 'dirigeant',
		title: 'Guide Urssaf pour les indépendants',
	},
]
