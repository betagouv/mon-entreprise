import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { TrackPage } from '@/components/ATInternetTracking'
import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
import { WhenNotAlreadyDefined } from '@/components/EngineValue/WhenNotAlreadyDefined'
import PageHeader from '@/components/PageHeader'
import ShareOrSaveSimulationBanner from '@/components/ShareSimulationBanner'
import Warning from '@/components/ui/WarningBlock'
import { useEngine } from '@/components/utils/EngineContext'
import {
	Body,
	Button,
	Grid,
	Intro,
	Li,
	Link,
	SmallBody,
	Spacing,
	Strong,
	Ul,
} from '@/design-system'
import useSimulationConfig from '@/hooks/useSimulationConfig'
import { useSitePaths } from '@/sitePaths'
import { resetSimulation } from '@/store/actions/actions'
import { situationSelector } from '@/store/selectors/simulationSelectors'

import Formulaire from './components/Formulaire'
import Résultats from './components/Résultats'
import { configDéclarationRevenusPAMC } from './simulationConfig'

export default function DéclarationRevenusPAMC() {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const engine = useEngine()
	const situation = useSelector(situationSelector)
	const { absoluteSitePaths } = useSitePaths()

	useSimulationConfig({
		key: absoluteSitePaths.assistants['déclaration-revenus-pamc'],
		config: configDéclarationRevenusPAMC,
		autoloadLastSimulation: true,
	})

	const isFormValid = engine.evaluate({
		'!=': ['déclaration revenus PAMC . résultats', 'non'],
	}).nodeValue

	const scrollToResults = () =>
		document
			.getElementById('déclaration-revenus-pamc-résultats')
			?.scrollIntoView({ behavior: 'smooth' })

	return (
		<>
			{Object.keys(situation).length ? (
				<>
					<WhenAlreadyDefined dottedName="déclaration revenus PAMC . résultats">
						<TrackPage name="simulation terminée" />
					</WhenAlreadyDefined>
					<WhenNotAlreadyDefined dottedName="déclaration revenus PAMC . résultats">
						<TrackPage name="simulation_commencee" />
					</WhenNotAlreadyDefined>
				</>
			) : (
				<TrackPage name="accueil" />
			)}

			<div className="print-hidden">
				<PageHeader>
					<Trans i18nKey="pages.assistants.declaration-revenus-pamc.description">
						<Intro>
							Cet outil est une aide à la déclaration de revenus des{' '}
							<Strong>
								praticiens et auxiliaires médicaux conventionnés (PAMC)
							</Strong>
							. Il a pour but de vous aider à remplir le volet social de votre
							déclaration de revenus à réaliser sur{' '}
							<Link
								href="https://www.impots.gouv.fr"
								aria-label="impots.gouv.fr, nouvelle fenêtre"
							>
								impots.gouv.fr
							</Link>
							.
						</Intro>
						<SmallBody>
							Vous restez entièrement responsable d’éventuelles omissions ou
							inexactitudes dans votre déclaration.
						</SmallBody>
					</Trans>
				</PageHeader>

				<Warning localStorageKey="pages.assistants.declaration-revenus-pamc.warning">
					<Ul>
						<Trans i18nKey="pages.assistants.declaration-revenus-pamc.warning">
							<StyledLi>
								Cet assistant <Strong>ne permet pas</Strong> de transmettre
								votre déclaration de revenus.
							</StyledLi>
							<StyledLi>
								<Strong>En cas de déficit</Strong>, renseignez le signe « - »
								devant le montant.
							</StyledLi>
							<StyledLi>
								<Strong>
									L’assistant ne prend pas en compte les situations suivantes :
								</Strong>
								<Ul>
									<Li>revenus étrangers,</Li>
									<Li>revenus non professionnels,</Li>
									<Li>changement de régime en cours d’année,</Li>
									<Li>comptabilités d’engagement,</Li>
									<Li>médecins adhérents au dispositif RSPM.</Li>
								</Ul>
								Si vous êtes dans l’une de ces situations, nous vous invitons à
								contacter votre Urssaf pour vous accompagner.
							</StyledLi>
						</Trans>
					</Ul>
					<Body>
						<Trans i18nKey="simulateurs.warning.general">
							<Strong>Les calculs sont indicatifs.</Strong> Ils sont faits à
							partir des éléments que vous avez saisis et des éléments
							réglementaires applicables, mais ils ne tiennent pas compte de
							l’ensemble de votre situation.{' '}
							<Strong>Ils ne se substituent pas aux décomptes réels</Strong> de
							l’Urssaf, de l’administration fiscale ou de tout autre organisme.
						</Trans>
					</Body>
				</Warning>

				<Formulaire />

				<Spacing lg />

				<GridContainer container spacing={6}>
					<Grid item xs={12} md={3}>
						<StyledButton isDisabled={!isFormValid} onPress={scrollToResults}>
							{t(
								'pages.assistants.declaration-revenus-pamc.buttons.results',
								'Voir les résultats'
							)}
						</StyledButton>
					</Grid>

					<Grid item xs={12} md={3}>
						<StyledButton
							light
							onPress={() => {
								dispatch(resetSimulation())
							}}
						>
							{t(
								'pages.assistants.declaration-revenus-pamc.buttons.reset',
								'Réinitialiser'
							)}
						</StyledButton>
					</Grid>
				</GridContainer>

				<Spacing xxl />
			</div>

			{isFormValid && (
				<>
					<Résultats id="déclaration-revenus-pamc-résultats" />
					<ShareOrSaveSimulationBanner share print />
				</>
			)}
		</>
	)
}

const StyledLi = styled(Li)`
	&::before {
		color: ${({ theme }) => theme.colors.bases.tertiary[800]} !important;
	}
`

const GridContainer = styled(Grid)`
	justify-content: space-around;
`

const StyledButton = styled(Button)`
	width: 100%;
`
