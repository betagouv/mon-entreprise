import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Condition } from '@/components/EngineValue/Condition'
import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
import { SimulationValue } from '@/components/Simulation/SimulationValue'
import { Emoji } from '@/design-system/emoji'
import { Container, Spacing } from '@/design-system/layout'
import { H2, H4 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'

import { LigneImpôts } from './LigneImpôts'

export default function Résultats() {
	const { t } = useTranslation()

	return (
		<WhenAlreadyDefined dottedName="déclaration revenus PAMC . résultats">
			<Container
				forceTheme="dark"
				backgroundColor={(theme) => theme.colors.bases.primary[600]}
			>
				<H2>
					<Emoji emoji="📄" />{' '}
					{t(
						'pages.assistants.declaration-revenus-pamc.resultats.1',
						'Montants à reporter dans votre déclaration de revenus'
					)}
				</H2>

				<SimulationValue
					dottedName="déclaration revenus PAMC . statut"
					label="Situation au 1er janvier ou à la date du début d’activité"
				/>

				<LigneImpôts
					dottedName="déclaration revenus PAMC . recettes brutes totales"
					code="DSCS"
					label="Recettes brutes totales tirées des activités non salariées"
				/>

				<Condition expression="déclaration revenus PAMC . revenus de remplacement . total">
					<H4 as="h3">
						{t(
							'pages.assistants.declaration-revenus-pamc.resultats.2',
							'Montant des revenus de remplacement'
						)}
					</H4>
				</Condition>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . revenus de remplacement . AJPA"
					code="DSAG"
					label="Montant des allocations journalières du proche aidant (AJPA) versées par la CAF"
				/>

				<Condition expression="déclaration revenus PAMC . déductions et exonérations . total déductible">
					<H4 as="h3">
						{t(
							'pages.assistants.declaration-revenus-pamc.resultats.3',
							'Déductions et exonérations'
						)}
					</H4>
				</Condition>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . déductions et exonérations . zone déficitaire en offre de soins"
					code="DSFA"
					label="Exonération zone déficitaire en offre de soins"
				/>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . déductions et exonérations . chèques vacances"
					code="DSCN"
					label="Chèques vacances déduits du revenu imposable"
				/>

				<H4 as="h3">
					{t(
						'pages.assistants.declaration-revenus-pamc.resultats.4',
						'Cotisations sociales obligatoires'
					)}
				</H4>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . cotisations sociales obligatoires"
					code="DSCA"
					label="Cotisations sociales obligatoires déduites du résultat imposable"
				/>

				<H4 as="h3">
					{t(
						'pages.assistants.declaration-revenus-pamc.resultats.5',
						'Répartition des revenus nets'
					)}
				</H4>
				<StyledBody>
					{t(
						'pages.assistants.declaration-revenus-pamc.resultats.6',
						'Revenus nets de l’activité conventionnée :'
					)}
				</StyledBody>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . revenus nets . revenus conventionnés"
					code="DSGA"
					label="Bénéfice"
				/>
				<StyledBody>
					{t(
						'pages.assistants.declaration-revenus-pamc.resultats.7',
						'Revenus nets tirés des autres activités non salariées :'
					)}
				</StyledBody>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . revenus nets . revenus non conventionnés"
					code="DSCR"
					label="Bénéfice"
				/>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . revenus nets . revenus structures de soins"
					code="DSAT"
					label="Dont revenus nets de l’activité réalisée dans des structures de soins"
				/>

				<H4 as="h3">
					{t(
						'pages.assistants.declaration-revenus-pamc.resultats.8',
						'Données transmises par l’Assurance Maladie'
					)}
				</H4>
				<Condition expression="déclaration revenus PAMC . profession != 'dentiste'">
					<LigneImpôts
						dottedName="déclaration revenus PAMC . SNIR . honoraires remboursables"
						code="DSAV"
					/>
					<LigneImpôts
						dottedName="déclaration revenus PAMC . SNIR . dépassements honoraires"
						code="DSAW"
					/>
				</Condition>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . SNIR . honoraires tarifs opposables"
					code="DSAX"
				/>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . SNIR . honoraires hors forfaits"
					code="DSAY"
				/>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . SNIR . taux urssaf"
					code="DSAZ"
				/>

				<Spacing xxl />
			</Container>
		</WhenAlreadyDefined>
	)
}

const StyledBody = styled(Body)`
	margin-bottom: 0;
`
