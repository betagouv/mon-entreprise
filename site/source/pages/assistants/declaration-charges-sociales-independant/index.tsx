import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { TrackPage } from '@/components/ATInternetTracking'
import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
import PageHeader from '@/components/PageHeader'
import { FromTop } from '@/components/ui/animate'
import Warning from '@/components/ui/WarningBlock'
import { Body, H2, Intro, Li, SmallBody, Strong, Ul } from '@/design-system'
import useSimulationConfig from '@/hooks/useSimulationConfig'
import { useSitePaths } from '@/sitePaths'
import { situationSelector } from '@/store/selectors/simulationSelectors'

import Formulaire from './components/Formulaire'
import ImpositionSection from './components/ImpositionSection'
import Résultats from './components/Résultats'
import { config } from './simulationConfig'
import illustration from './undraw_fill_in_mie5.svg'

export default function AideDéclarationIndépendant() {
	const { absoluteSitePaths } = useSitePaths()
	useSimulationConfig({
		key: absoluteSitePaths.assistants[
			'déclaration-charges-sociales-indépendant'
		],
		config,
		autoloadLastSimulation: true,
	})
	const situation = useSelector(situationSelector)

	return (
		<>
			<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.description">
				<PageHeader picture={illustration}>
					<Intro>
						Cet outil est une aide à la déclaration de revenus à destination des{' '}
						<Strong>travailleurs indépendants</Strong>. Il vous permet de
						connaître le montant des charges sociales déductibles.
					</Intro>
					<SmallBody>
						Vous restez entièrement responsable d’éventuelles omissions ou
						inexactitudes dans votre déclaration.
					</SmallBody>
				</PageHeader>

				<Warning localStorageKey="aide-déclaration-indépendant.warning">
					<Body>
						<Strong>
							Cet outil vous concerne si vous êtes dans le cas suivant :
						</Strong>
					</Body>
					<Body>
						Vous cotisez au régime général des travailleurs indépendants
					</Body>
					<Body>
						<Strong>
							Il ne vous concerne pas si vous êtes dans un des cas suivants :
						</Strong>
					</Body>
					<Ul>
						<Li>
							Vous exercez une activité libérale relevant d’un régime de
							retraite des professions libérales en comptabilité d’engagement
						</Li>
						<Li>Votre entreprise est domiciliée dans les DOM</Li>
					</Ul>
				</Warning>

				<H2>Imposition</H2>
				<Body>
					Ces quelques questions permettent de déterminer le type de déclaration
					à remplir, ainsi que les modalités de calcul des cotisations sociales.
				</Body>
			</Trans>

			{Object.keys(situation).length ? (
				<TrackPage name="simulation_commencee" />
			) : (
				<TrackPage name="accueil" />
			)}

			<ImpositionSection />

			<FromTop>
				<Formulaire />
			</FromTop>

			<WhenAlreadyDefined dottedName="déclaration charge sociales . résultat . total charges sociales déductible">
				<Résultats />
			</WhenAlreadyDefined>
		</>
	)
}

export const Question = styled.div`
	margin-top: 1em;
`
