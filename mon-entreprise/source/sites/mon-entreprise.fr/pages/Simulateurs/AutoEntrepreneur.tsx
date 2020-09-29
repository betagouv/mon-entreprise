import Warning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import autoEntrepreneurConfig from 'Components/simulationConfigs/auto-entrepreneur.yaml'
import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { EngineContext } from 'Components/utils/EngineContext'
import Meta from 'Components/utils/Meta'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { default as React, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { targetUnitSelector } from 'Selectors/simulationSelectors'
import AutoEntrepreneurPreview from './images/AutoEntrepreneurPreview.png'
import Emoji from 'Components/utils/Emoji'
import { RessourceAutoEntrepreneur } from '../Créer/CreationChecklist'
import RuleLink from 'Components/RuleLink'

export default function AutoEntrepreneur() {
	const inIframe = useContext(IsEmbeddedContext)
	const { t, i18n } = useTranslation()
	const META = {
		title: t(
			'pages.simulateurs.auto-entrepreneur.meta.titre',
			'Auto-entrepreneurs : simulateur de revenus'
		),
		description: t(
			'pages.simulateurs.auto-entrepreneur.meta.description',
			"Calcul de votre revenu à partir du chiffre d'affaires, après déduction des cotisations et de l'impôt sur le revenu."
		),
		ogTitle: t(
			'pages.simulateurs.auto-entrepreneur.meta.ogTitle',
			'Auto-entrepreneur : calculez rapidement votre revenu net à partir du CA et vice-versa'
		),
		ogDescription: t(
			'pages.simulateurs.auto-entrepreneur.meta.ogDescription',
			"Grâce au simulateur de revenu auto-entrepreneur développé par l'Urssaf, vous pourrez estimer le montant de vos revenus en fonction de votre chiffre d'affaire mensuel ou annuel pour mieux gérer votre trésorerie. Ou dans le sens inverse : savoir quel montant facturer pour atteindre un certain revenu."
		),
		...(i18n.language === 'fr' && { ogImage: AutoEntrepreneurPreview })
	}
	const isEmbedded = React.useContext(IsEmbeddedContext)
	return (
		<>
			<Meta {...META} />
			{!inIframe && (
				<h1>
					<Trans i18nKey="pages.simulateurs.auto-entrepreneur.titre">
						Simulateur de revenus auto-entrepreneur
					</Trans>
				</h1>
			)}
			<Warning simulateur="auto-entrepreneur" />
			<Simulation
				config={autoEntrepreneurConfig}
				explanations={<ExplanationSection />}
			/>
			{!isEmbedded && <SeoExplanations />}
		</>
	)
}

function ExplanationSection() {
	const engine = useContext(EngineContext)
	const { t } = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)
	const targetUnit = useSelector(targetUnitSelector)
	const impôt = engine.evaluate('impôt', { unit: targetUnit })

	return (
		<section>
			<h2>
				<Trans>Répartition du chiffre d'affaires</Trans>
			</h2>
			<StackedBarChart
				data={[
					{
						...engine.evaluate(
							'dirigeant . auto-entrepreneur . net après impôt',
							{ unit: targetUnit }
						),
						title: t("Revenu (incluant les dépenses liées à l'activité)"),
						color: palettes[0][0]
					},

					...(impôt.nodeValue
						? [{ ...impôt, title: t('impôt'), color: palettes[1][0] }]
						: []),
					{
						...engine.evaluate(
							'dirigeant . auto-entrepreneur . cotisations et contributions',
							{ unit: targetUnit }
						),
						title: t('Cotisations'),
						color: palettes[1][1]
					}
				]}
			/>
		</section>
	)
}

function SeoExplanations() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<Trans i18nKey="pages.simulateurs.auto-entrepreneur.seo explanation">
			<h2>Comment calculer le revenu net d'un auto-entrepreneur ?</h2>
			<p>
				Un auto-entrepreneur doit payer des cotisations sociales à
				l'administration. Ces cotisations servent au financement de la sécurité
				sociale, et ouvrent des droits pour la retraite ou pour l'assurance
				maladie. Elle permettent également de financer la formation
				professionnelle. Leur montant varie en fonction du type d'activité.
			</p>
			<p>
				<Emoji emoji="👉" />{' '}
				<RuleLink dottedName="dirigeant . auto-entrepreneur . cotisations et contributions">
					Voir le détail du calcul des cotisations
				</RuleLink>
			</p>
			<p>
				Il ne faut pas oublier de retrancher toutes les dépenses effectuées dans
				le cadre de l'activité professionnelle (équipements, matière premières,
				local, transport). Bien qu'elles ne soient pas utilisées pour le calcul
				des cotisations et de l'impôt, elles doivent être prises en compte pour
				vérifier si l'activité est viable économiquement.
			</p>
			<p>
				La formule de calcul complète est donc :
				<blockquote>
					<strong>
						Revenu net = Chiffres d'affaires − Cotisations sociales − Dépenses
						professionnelles
					</strong>
				</blockquote>
			</p>
			<h2>
				Comment calculer l'impôt sur le revenu pour un auto-entrepreneur ?
			</h2>
			<p>
				Si vous avez opté pour le versement libératoire lors de la création de
				votre auto-entreprise, l'impôt sur le revenu est payé en même temps que
				les cotisations sociales.
			</p>
			<p>
				<Emoji emoji="👉" />{' '}
				<RuleLink dottedName="dirigeant . auto-entrepreneur . impôt . versement libératoire . montant">
					Voir comment est calculé le montant du versement libératoire
				</RuleLink>
			</p>
			<p>
				Sinon, vous serez imposé selon le barème standard de l'impôt sur le
				revenu. Le revenu imposable est alors calculé comme un pourcentage du
				chiffre d'affaires. C'est qu'on appel l'abattement forfaitaire. Ce
				pourcentage varie en fonction du type d'activité excercé. On dit qu'il
				est forfaitaire car il ne prends pas en compte les dépenses réelles
				effectuées dans le cadre de l'activité.
			</p>
			<p>
				<Emoji emoji="👉" />{' '}
				<RuleLink dottedName="dirigeant . auto-entrepreneur . impôt . revenu abattu">
					Voir le détail du calcul du revenu abattu pour un auto-entrepreneur
				</RuleLink>
			</p>
			<h2>
				<Trans>Ressources utiles</Trans>
			</h2>
			<div style={{ display: 'flex', flexWrap: 'wrap' }}>
				<RessourceAutoEntrepreneur />
			</div>
		</Trans>
	)
}
