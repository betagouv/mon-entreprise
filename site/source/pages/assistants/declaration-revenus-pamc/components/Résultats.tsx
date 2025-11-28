import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Condition } from '@/components/EngineValue/Condition'
import { Body, Container, Emoji, H2, H4, theme } from '@/design-system'
import { codesImpôt } from '@/domaine/CodesImpôt'

import DéclarantSelection from './DéclarantSelection'
import { LigneImpôts } from './LigneImpôts'

type Props = {
	id: string
}

export default function Résultats({ id }: Props) {
	const { t } = useTranslation()
	const date = new Date()
	const [déclarant, setDéclarant] = useState<'1' | '2'>('1')

	return (
		<Container
			id={id}
			forceTheme="dark"
			backgroundColor={(theme) => theme.colors.bases.primary[600]}
		>
			<Body className="print-only">
				{date.toLocaleDateString() + ' - ' + date.toLocaleTimeString()}
			</Body>

			<H2>
				<Emoji emoji="📄" />{' '}
				{t(
					'pages.assistants.declaration-revenus-pamc.resultats.title.1',
					'Montants à reporter dans votre déclaration de revenus'
				)}
			</H2>

			<DéclarantSelection déclarant={déclarant} setDéclarant={setDéclarant} />
			<StyledBody>
				{t(
					'pages.assistants.declaration-revenus-pamc.resultats.label.1',
					'Situation au 1er janvier ou à la date du début d’activité'
				)}
			</StyledBody>
			<ListeLignes>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . statut"
					code={codesImpôt.DSAP[déclarant]}
					expression="déclaration revenus PAMC . statut = 'titulaire'"
					label={t(
						'pages.assistants.declaration-revenus-pamc.resultats.label.2',
						'Vous êtes titulaire'
					)}
				/>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . statut"
					code={codesImpôt.DSAQ[déclarant]}
					expression="déclaration revenus PAMC . statut = 'remplaçant'"
					label={t(
						'pages.assistants.declaration-revenus-pamc.resultats.label.3',
						'Vous êtes remplaçant'
					)}
				/>

				<LigneImpôts
					dottedName="déclaration revenus PAMC . recettes brutes totales"
					code={codesImpôt.DSCS[déclarant]}
					label={t(
						'pages.assistants.declaration-revenus-pamc.resultats.label.4',
						'Recettes brutes totales tirées des activités non salariées'
					)}
				/>
			</ListeLignes>

			<Condition expression="déclaration revenus PAMC . revenus de remplacement . total">
				<H4 as="h3">
					{t(
						'pages.assistants.declaration-revenus-pamc.resultats.title.2',
						'Montant des revenus de remplacement'
					)}
				</H4>
			</Condition>

			<ListeLignes>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . revenus de remplacement . IJ"
					code={codesImpôt.DSAS[déclarant]}
				/>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . revenus de remplacement . AJPA"
					code={codesImpôt.DSAG[déclarant]}
				/>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . revenus de remplacement . indemnités incapacité temporaire"
					code={codesImpôt.DSCP[déclarant]}
				/>
			</ListeLignes>

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
				code={codesImpôt.DSFA[déclarant]}
			/>
			<LigneImpôts
				dottedName="déclaration revenus PAMC . déductions et exonérations . déduction groupe III"
				code={codesImpôt.DSCO[déclarant]}
				label={t(
					'pages.assistants.declaration-revenus-pamc.resultats.label.5',
					'Médecin secteur 1 - déduction complémentaire 3%'
				)}
			/>
			<LigneImpôts
				dottedName="déclaration revenus PAMC . déductions et exonérations . chèques vacances"
				code={codesImpôt.DSCN[déclarant]}
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

			<ListeLignes>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . cotisations sociales obligatoires"
					code={codesImpôt.DSCA[déclarant]}
					label={t(
						'pages.assistants.declaration-revenus-pamc.resultats.label.7',
						'Cotisations sociales obligatoires déduites du résultat imposable'
					)}
				/>
			</ListeLignes>

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

			<ListeLignes>
				<Condition expression="déclaration revenus PAMC . revenus nets . revenus conventionnés >= 0">
					<LigneImpôts
						dottedName="déclaration revenus PAMC . revenus nets . revenus conventionnés"
						code={codesImpôt.DSGA[déclarant]}
						label={t('Bénéfice', 'Bénéfice')}
					/>
				</Condition>
				<Condition expression="déclaration revenus PAMC . revenus nets . revenus conventionnés < 0">
					<LigneImpôts
						dottedName="déclaration revenus PAMC . revenus nets . revenus conventionnés"
						code={codesImpôt.DSHA[déclarant]}
						label={t('Déficit', 'Déficit')}
					/>
				</Condition>
			</ListeLignes>

			<StyledBody>
				{t(
					'pages.assistants.declaration-revenus-pamc.resultats.label.9',
					'Revenus nets tirés des autres activités non salariées :'
				)}
			</StyledBody>
			<Condition expression="déclaration revenus PAMC . revenus nets . revenus non conventionnés >= 0">
				<LigneImpôts
					dottedName="déclaration revenus PAMC . revenus nets . revenus non conventionnés"
					code={codesImpôt.DSCR[déclarant]}
					label={t('Bénéfice', 'Bénéfice')}
				/>
			</Condition>
			<Condition expression="déclaration revenus PAMC . revenus nets . revenus non conventionnés < 0">
				<LigneImpôts
					dottedName="déclaration revenus PAMC . revenus nets . revenus non conventionnés"
					code={codesImpôt.DSCQ[déclarant]}
					label={t('Déficit', 'Déficit')}
				/>
			</Condition>

			<LigneImpôts
				dottedName="déclaration revenus PAMC . revenus nets . revenus structures de soins"
				code={codesImpôt.DSAT[déclarant]}
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
				code={codesImpôt.DSEA[déclarant]}
			/>
			<LigneImpôts
				dottedName="déclaration revenus PAMC . cotisations facultatives . activité conventionnée"
				code={codesImpôt.DSAR[déclarant]}
				label={t(
					'pages.assistants.declaration-revenus-pamc.resultats.label.11',
					'Dont cotisations facultatives liées à l’activité conventionnée'
				)}
			/>
			<LigneImpôts
				dottedName="déclaration revenus PAMC . cotisations facultatives . autres activités non salariées"
				code={codesImpôt.DSCM[déclarant]}
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

			<ListeLignes>
				<Condition expression="déclaration revenus PAMC . profession != 'dentiste'">
					<LigneImpôts
						dottedName="déclaration revenus PAMC . SNIR . honoraires remboursables"
						code={codesImpôt.DSAV[déclarant]}
					/>
					<LigneImpôts
						dottedName="déclaration revenus PAMC . SNIR . dépassements honoraires"
						code={codesImpôt.DSAW[déclarant]}
					/>
				</Condition>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . SNIR . honoraires tarifs opposables"
					code={codesImpôt.DSAX[déclarant]}
				/>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . SNIR . honoraires hors forfaits"
					code={codesImpôt.DSAY[déclarant]}
				/>
				<LigneImpôts
					dottedName="déclaration revenus PAMC . SNIR . taux urssaf"
					code={codesImpôt.DSAZ[déclarant]}
					arrondi={false}
				/>
			</ListeLignes>
		</Container>
	)
}

const StyledBody = styled(Body)`
	margin-bottom: 0;
`
const ListeLignes = styled.ul`
	margin: 0;
	padding-left: 0;

	&:empty {
		display: none;
	}

	&:last-child {
		margin-bottom: ${theme.spacings.xxl};
	}
`
