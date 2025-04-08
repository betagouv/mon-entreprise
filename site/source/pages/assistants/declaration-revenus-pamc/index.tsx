import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { TrackPage } from '@/components/ATInternetTracking'
import { Condition } from '@/components/EngineValue/Condition'
import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
import { WhenNotAlreadyDefined } from '@/components/EngineValue/WhenNotAlreadyDefined'
import ShareOrSaveSimulationBanner from '@/components/ShareSimulationBanner'
import Warning from '@/components/ui/WarningBlock'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import useSimulationConfig from '@/hooks/useSimulationConfig'
import { useSitePaths } from '@/sitePaths'
import { resetSimulation } from '@/store/actions/actions'
import { situationSelector } from '@/store/selectors/simulationSelectors'

import Formulaire from './components/Formulaire'
import Résultats from './components/Résultats'
import { configDéclarationRevenusPAMC } from './simulationConfig'

export default function DéclarationRevenusPAMC() {
	const { absoluteSitePaths } = useSitePaths()
	useSimulationConfig({
		key: absoluteSitePaths.assistants['déclaration-revenus-pamc'],
		config: configDéclarationRevenusPAMC,
		autoloadLastSimulation: true,
	})
	const situation = useSelector(situationSelector)
	const dispatch = useDispatch()

	return (
		<>
			{Object.keys(situation).length ? (
				<>
					<WhenAlreadyDefined dottedName="déclaration revenus PAMC . résultats">
						<TrackPage name="simulation terminée" />
					</WhenAlreadyDefined>
					<WhenNotAlreadyDefined dottedName="déclaration revenus PAMC . résultats">
						<TrackPage name="simulation commencée" />
					</WhenNotAlreadyDefined>
				</>
			) : (
				<TrackPage name="accueil" />
			)}

			<div className="print-hidden">
				<Warning localStorageKey="pages.assistants.declaration-revenus-pamc.warning">
					<Ul>
						<Trans i18nKey="pages.assistants.declaration-revenus-pamc.warning">
							<StyledLi>
								Cet assistant est à destination des{' '}
								<Strong>
									praticiens et auxiliaires médicaux conventionnés (PAMC)
								</Strong>
								.
							</StyledLi>
							<StyledLi>
								Il a pour but de vous aider à remplir le volet social de votre
								déclaration de revenus à réaliser sur{' '}
								<Link
									href="https://www.impots.gouv.fr"
									aria-label="impots.gouv.fr, nouvelle fenêtre"
								>
									impots.gouv.fr
								</Link>
								.
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

				<Button
					onPress={() => {
						dispatch(resetSimulation())
					}}
				>
					Réinitialiser
				</Button>

				<Spacing xxl />
			</div>

			<Condition expression="déclaration revenus PAMC . résultats">
				<Résultats />
				<ShareOrSaveSimulationBanner share print />
			</Condition>
		</>
	)
}

const StyledLi = styled(Li)`
	&::before {
		color: ${({ theme }) => theme.colors.bases.tertiary[800]} !important;
	}
`
