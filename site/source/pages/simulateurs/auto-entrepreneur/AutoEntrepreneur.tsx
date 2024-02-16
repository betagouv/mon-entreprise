import { Trans, useTranslation } from 'react-i18next'
import { useTheme } from 'styled-components'

import ChiffreAffairesActivitéMixte from '@/components/ChiffreAffairesActivitéMixte'
import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
import PeriodSwitch from '@/components/PeriodSwitch'
import RuleLink from '@/components/RuleLink'
import { SelectSimulationYear } from '@/components/SelectSimulationYear'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { InstitutionsPartenairesAutoEntrepreneur } from '@/components/simulationExplanation/InstitutionsPartenaires'
import StackedBarChart from '@/components/StackedBarChart'
import { Message } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { H2 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'

export default function AutoEntrepreneur() {
	return (
		<>
			<Simulation
				explanations={<Explanation />}
				afterQuestionsSlot={<SelectSimulationYear />}
			>
				<SimulateurWarning simulateur="auto-entrepreneur" />
				<SimulationGoals
					toggles={<PeriodSwitch />}
					legend="Vos revenus d'auto-entrepreneur"
				>
					<ChiffreAffairesActivitéMixte dottedName="dirigeant . auto-entrepreneur . chiffre d'affaires" />
					<SimulationGoal
						small
						editable={false}
						dottedName="dirigeant . auto-entrepreneur . cotisations et contributions"
					/>
					<SimulationGoal dottedName="dirigeant . auto-entrepreneur . revenu net" />
					<WhenAlreadyDefined dottedName="entreprise . chiffre d'affaires">
						<SimulationGoal
							small
							editable={false}
							dottedName="dirigeant . rémunération . impôt"
						/>
					</WhenAlreadyDefined>
					<SimulationGoal dottedName="dirigeant . auto-entrepreneur . revenu net . après impôt" />
				</SimulationGoals>
			</Simulation>
		</>
	)
}

function Explanation() {
	const { t } = useTranslation()
	const { colors } = useTheme()

	return (
		<section>
			<H2>
				<Trans>Répartition du chiffre d'affaires</Trans>
			</H2>
			<StackedBarChart
				data={[
					{
						dottedName: 'dirigeant . rémunération . net . après impôt',
						title: t("Revenu (incluant les dépenses liées à l'activité)"),
						color: colors.bases.primary[600],
					},
					{
						dottedName: 'impôt . montant',
						title: t('impôt'),
						color: colors.bases.secondary[500],
					},
					{
						dottedName:
							'dirigeant . auto-entrepreneur . cotisations et contributions',
						title: t('Cotisations'),
						color: colors.extended.grey[700],
					},
				]}
			/>
			<InstitutionsPartenairesAutoEntrepreneur />
		</section>
	)
}

export const SeoExplanations = () => (
	<Trans i18nKey="pages.simulateurs.auto-entrepreneur.seo explanation">
		<H2>Comment calculer le revenu net d'un auto-entrepreneur ?</H2>
		<Body>
			Un auto-entrepreneur doit payer des cotisations et contributions sociales
			à l'administration. Ces cotisations servent au financement de la sécurité
			sociale, et ouvrent des droits notamment pour la retraite et pour
			l'assurance maladie. Elles permettent également de financer la formation
			professionnelle. Leur montant varie en fonction du type d'activité.
		</Body>
		<Body>
			<Emoji emoji="👉" />{' '}
			<RuleLink dottedName="dirigeant . auto-entrepreneur . cotisations et contributions">
				Voir le détail du calcul des cotisations
			</RuleLink>
		</Body>
		<Body>
			Il ne faut pas oublier de retrancher toutes les dépenses effectuées dans
			le cadre de l'activité professionnelle (équipements, matières premières,
			local, transport). Bien qu'elles ne soient pas utilisées pour le calcul
			des cotisations et de l'impôt, elles doivent être prises en compte pour
			vérifier si l'activité est viable économiquement.
		</Body>
		<Body>La formule de calcul complète est donc :</Body>
		<Message
			role="presentation"
			mini
			border={false}
			style={{
				width: 'fit-content',
			}}
		>
			Revenu net = Chiffres d'affaires − Cotisations sociales − Dépenses
			professionnelles
		</Message>
		<H2>Comment calculer l'impôt sur le revenu pour un auto-entrepreneur ?</H2>
		<Body>
			Si vous avez opté pour le versement libératoire lors de la création de
			votre auto-entreprise, l'impôt sur le revenu est payé en même temps que
			les cotisations sociales.
		</Body>
		<Body>
			<Emoji emoji="👉" />{' '}
			<RuleLink dottedName="dirigeant . auto-entrepreneur . impôt . versement libératoire . montant">
				Voir comment est calculé le montant du versement libératoire
			</RuleLink>
		</Body>
		<Body>
			Sinon, vous serez imposé selon le barème standard de l'impôt sur le
			revenu. Le revenu imposable est alors calculé comme un pourcentage du
			chiffre d'affaires. C'est qu'on appel l'abattement forfaitaire. Ce
			pourcentage varie en fonction du type d'activité excercé. On dit qu'il est
			forfaitaire car il ne prend pas en compte les dépenses réelles effectuées
			dans le cadre de l'activité.
		</Body>
		<Body>
			<Emoji emoji="👉" />{' '}
			<RuleLink dottedName="dirigeant . auto-entrepreneur . impôt . revenu imposable">
				Voir le détail du calcul du revenu abattu pour un auto-entrepreneur
			</RuleLink>
		</Body>
		<H2>Information clé sur la TVA pour les auto-entrepreneurs</H2>
		<Body>
			En tant qu'auto-entrepreneur, il est important de comprendre votre
			responsabilité concernant la TVA. Généralement, les auto-entrepreneurs
			sont exemptés de TVA jusqu'à ce que leur chiffre d'affaires atteigne un
			certain seuil, qui varie en fonction de la nature de l'activité (services
			ou vente de marchandises).
		</Body>
		<Body>
			Une fois ce seuil dépassé, vous êtes tenu de collecter et de déclarer la
			TVA sur vos ventes ou services. Le taux de TVA appliqué dépend du type
			d'activité et peut varier, mais le taux standard est souvent autour de
			20%. Il est essentiel de se tenir informé des seuils actuels et des taux
			applicables, car ils peuvent évoluer avec le temps.
		</Body>
	</Trans>
)
