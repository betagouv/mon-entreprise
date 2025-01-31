import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { TrackPage } from '@/components/ATInternetTracking'
import Warning from '@/components/ui/WarningBlock'
import { Message } from '@/design-system'
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
				<TrackPage name="simulation commencée" />
			) : (
				<TrackPage name="accueil" />
			)}

			<Warning localStorageKey="pages.assistants.declaration-revenus-pamc.warning">
				<Ul>
					<StyledLi>
						Cet assistant est à destination des{' '}
						<Strong>
							praticiens et auxiliaires médicaux conventionnés (PAMC)
						</Strong>
						.
					</StyledLi>
					<StyledLi>
						Il a pour but de vous aider à remplir le{' '}
						<Strong>volet social de votre déclaration de revenus</Strong> à
						réaliser sur{' '}
						<Link
							href="https://www.impots.gouv.fr"
							aria-label="impots.gouv.fr, nouvelle fenêtre"
						>
							impots.gouv.fr
						</Link>
						.
					</StyledLi>
					<StyledLi>
						<Strong>En cas de déficit</Strong>, renseignez le signe « - » devant
						le montant.
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

			<Message type="secondary" icon>
				<Body>Afin de faciliter le remplissage, préparez :</Body>
				<Ul>
					<Li>l’ensemble des recettes encaissées,</Li>
					<Li>le détail des cotisations versées à l’Urssaf,</Li>
					<Li>le détail des cotisations versées à votre caisse de retraite.</Li>
				</Ul>
			</Message>

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

			<Résultats />
		</>
	)
}

const StyledLi = styled(Li)`
	&::before {
		color: ${({ theme }) => theme.colors.bases.tertiary[800]} !important;
	}
`
