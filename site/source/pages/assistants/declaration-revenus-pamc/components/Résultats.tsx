import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Condition } from '@/components/EngineValue/Condition'
import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
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
						'pages.assistants.declaration-revenus-pamc.resultats.title.1',
						'Montants à reporter dans votre déclaration de revenus'
					)}
				</H2>

				<StyledBody>
					{t(
						'pages.assistants.declaration-revenus-pamc.resultats.label.1',
						'Situation au 1er janvier ou à la date du début d’activité'
					)}
				</StyledBody>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . statut"
					code="DSAP"
					expression="déclaration revenus PAMC . statut = 'titulaire'"
					label={t(
						'pages.assistants.declaration-revenus-pamc.resultats.label.2',
						'Vous êtes titulaire'
					)}
				/>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . statut"
					code="DSAQ"
					expression="déclaration revenus PAMC . statut = 'remplaçant'"
					label={t(
						'pages.assistants.declaration-revenus-pamc.resultats.label.3',
						'Vous êtes remplaçant'
					)}
				/>

				<LigneImpôts
					dottedName="déclaration revenus PAMC . recettes brutes totales"
					code="DSCS"
					label={t(
						'pages.assistants.declaration-revenus-pamc.resultats.label.4',
						'Recettes brutes totales tirées des activités non salariées'
					)}
				/>

				<Condition expression="déclaration revenus PAMC . revenus de remplacement . total">
					<H4 as="h3">
						{t(
							'pages.assistants.declaration-revenus-pamc.resultats.title.2',
							'Montant des revenus de remplacement'
						)}
					</H4>
				</Condition>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . revenus de remplacement . IJ"
					code="DSAS"
				/>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . revenus de remplacement . AJPA"
					code="DSAG"
				/>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . revenus de remplacement . indemnités incapacité temporaire"
					code="DSCP"
				/>

				<Condition expression="déclaration revenus PAMC . déductions et exonérations . total déductible">
					<H4 as="h3">
						{t(
							'pages.assistants.declaration-revenus-pamc.resultats.title.3',
							'Déductions et exonérations'
						)}
					</H4>
				</Condition>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . déductions et exonérations . zone déficitaire en offre de soins"
					code="DSFA"
				/>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . déductions et exonérations . déduction groupe III"
					code="DSCO"
					label={t(
						'pages.assistants.declaration-revenus-pamc.resultats.label.5',
						'Médecin secteur 1 - déduction complémentaire 3%'
					)}
				/>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . déductions et exonérations . chèques vacances"
					code="DSCN"
					label={t(
						'pages.assistants.declaration-revenus-pamc.resultats.label.6',
						'Chèques vacances déduits du revenu imposable'
					)}
				/>

				<H4 as="h3">
					{t(
						'pages.assistants.declaration-revenus-pamc.resultats.title.4',
						'Cotisations sociales obligatoires'
					)}
				</H4>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . cotisations sociales obligatoires"
					code="DSCA"
					label={t(
						'pages.assistants.declaration-revenus-pamc.resultats.label.7',
						'Cotisations sociales obligatoires déduites du résultat imposable'
					)}
				/>

				<H4 as="h3">
					{t(
						'pages.assistants.declaration-revenus-pamc.resultats.title.5',
						'Répartition des revenus nets'
					)}
				</H4>
				<StyledBody>
					{t(
						'pages.assistants.declaration-revenus-pamc.resultats.label.8',
						'Revenus nets de l’activité conventionnée :'
					)}
				</StyledBody>
				<Condition expression="déclaration revenus PAMC . revenus nets . revenus conventionnés >= 0">
					<LigneImpôts
						dottedName="déclaration revenus PAMC . revenus nets . revenus conventionnés"
						code="DSGA"
						label={t('Bénéfice', 'Bénéfice')}
					/>
				</Condition>
				<Condition expression="déclaration revenus PAMC . revenus nets . revenus conventionnés < 0">
					<LigneImpôts
						dottedName="déclaration revenus PAMC . revenus nets . revenus conventionnés"
						code="DSHA"
						label={t('Déficit', 'Déficit')}
					/>
				</Condition>

				<StyledBody>
					{t(
						'pages.assistants.declaration-revenus-pamc.resultats.label.9',
						'Revenus nets tirés des autres activités non salariées :'
					)}
				</StyledBody>
				<Condition expression="déclaration revenus PAMC . revenus nets . revenus non conventionnés >= 0">
					<LigneImpôts
						dottedName="déclaration revenus PAMC . revenus nets . revenus non conventionnés"
						code="DSCR"
						label={t('Bénéfice', 'Bénéfice')}
					/>
				</Condition>
				<Condition expression="déclaration revenus PAMC . revenus nets . revenus non conventionnés < 0">
					<LigneImpôts
						dottedName="déclaration revenus PAMC . revenus nets . revenus non conventionnés"
						code="DSCQ"
						label={t('Déficit', 'Déficit')}
					/>
				</Condition>

				<LigneImpôts
					dottedName="déclaration revenus PAMC . revenus nets . revenus structures de soins"
					code="DSAT"
					label={t(
						'pages.assistants.declaration-revenus-pamc.resultats.label.10',
						'Dont revenus nets de l’activité réalisée dans des structures de soins'
					)}
				/>

				<Condition expression="déclaration revenus PAMC . cotisations facultatives">
					<H4 as="h3">
						{t(
							'pages.assistants.declaration-revenus-pamc.resultats.title.6',
							'Cotisations facultatives'
						)}
					</H4>
				</Condition>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . cotisations facultatives"
					code="DSEA"
				/>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . cotisations facultatives . activité conventionnée"
					code="DSAR"
					label={t(
						'pages.assistants.declaration-revenus-pamc.resultats.label.11',
						'Dont cotisations facultatives liées à l’activité conventionnée'
					)}
				/>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . cotisations facultatives . autres activités non salariées"
					code="DSAR"
					label={t(
						'pages.assistants.declaration-revenus-pamc.resultats.label.12',
						'Dont cotisations facultatives liées aux autres activités non salariées'
					)}
				/>

				<H4 as="h3">
					{t(
						'pages.assistants.declaration-revenus-pamc.resultats.title.7',
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
