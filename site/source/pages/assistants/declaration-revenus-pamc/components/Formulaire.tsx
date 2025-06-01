import { Trans, useTranslation } from 'react-i18next'

import { AssistantGoal } from '@/components/Assistant/AssistantGoal'
import { Condition } from '@/components/EngineValue/Condition'
import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
import { WhenAlreadyDefinedMulti } from '@/components/EngineValue/WhenAlreadyDefinedMulti'
import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import Notifications from '@/components/Notifications'
import { Body, H2, Li, Message, Ul } from '@/design-system'

import { SimpleField } from '../../components/Fields'

export default function Formulaire() {
	const { t } = useTranslation()

	return (
		<>
			<div aria-hidden>
				<Message>
					<Body>
						{t(
							'pages.assistants.declaration-revenus-pamc.formulaire.0',
							'Les champs obligatoires sont signalés par une astérisque.'
						)}
					</Body>
				</Message>
			</div>
			<H2>
				{t(
					'pages.assistants.declaration-revenus-pamc.formulaire.1',
					'Profession'
				)}
			</H2>
			<SimpleField dottedName="déclaration revenus PAMC . profession" />

			<WhenAlreadyDefined dottedName="déclaration revenus PAMC . profession">
				<SimpleField dottedName="déclaration revenus PAMC . statut" />
			</WhenAlreadyDefined>

			<WhenAlreadyDefinedMulti
				dottedNames={[
					'déclaration revenus PAMC . profession',
					'déclaration revenus PAMC . statut',
				]}
			>
				<H2>
					{t(
						'pages.assistants.declaration-revenus-pamc.formulaire.2',
						'Régime fiscal'
					)}
				</H2>
				<SimpleField dottedName="déclaration revenus PAMC . régime fiscal" />
			</WhenAlreadyDefinedMulti>

			<WhenAlreadyDefined dottedName="déclaration revenus PAMC . régime fiscal">
				<Message type="secondary" icon>
					<Condition expression="déclaration revenus PAMC . régime fiscal . IR micro-fiscal">
						<Trans i18nKey="pages.assistants.declaration-revenus-pamc.formulaire.conseil.MF">
							<Body>Afin de faciliter le remplissage, préparez :</Body>
							<Ul>
								<Li>l’ensemble des recettes encaissées,</Li>
								<Li>le détail des cotisations versées à l’Urssaf,</Li>
								<Li>
									le détail des cotisations versées à votre caisse de retraite.
								</Li>
							</Ul>
						</Trans>
					</Condition>
					<Condition expression="déclaration revenus PAMC . régime fiscal . IR non micro-fiscal">
						<Body>
							{t(
								'pages.assistants.declaration-revenus-pamc.formulaire.conseil.IR',
								'Afin de faciliter le remplissage, munissez-vous des annexes A et B de votre liasse fiscale 2035.'
							)}
						</Body>
					</Condition>
					<Condition expression="déclaration revenus PAMC . régime fiscal . IS">
						<Body>
							{t(
								'pages.assistants.declaration-revenus-pamc.formulaire.conseil.IS',
								'Afin de faciliter le remplissage, munissez-vous de votre liasse fiscale 2065.'
							)}
						</Body>
					</Condition>
				</Message>
			</WhenAlreadyDefined>

			<WhenAlreadyDefinedMulti
				dottedNames={[
					'déclaration revenus PAMC . profession',
					'déclaration revenus PAMC . statut',
					'déclaration revenus PAMC . régime fiscal',
				]}
			>
				<H2>
					{t(
						'pages.assistants.declaration-revenus-pamc.formulaire.3',
						'Recettes'
					)}
				</H2>
				<AssistantGoal dottedName="déclaration revenus PAMC . recettes brutes totales" />
				<AssistantGoal dottedName="déclaration revenus PAMC . revenus imposables" />
				<AssistantGoal dottedName="déclaration revenus PAMC . revenus des associés et gérants" />
				<AssistantGoal dottedName="déclaration revenus PAMC . dividendes" />
				<AssistantGoal dottedName="déclaration revenus PAMC . frais réels" />
				<AssistantGoal dottedName="déclaration revenus PAMC . cotisations sociales obligatoires" />

				<H2>
					<Condition expression="déclaration revenus PAMC . statut = 'titulaire'">
						{t(
							'pages.assistants.declaration-revenus-pamc.formulaire.4.titulaire',
							'Données du relevé SNIR'
						)}
					</Condition>
					<Condition expression="déclaration revenus PAMC . statut = 'remplaçant'">
						{t(
							'pages.assistants.declaration-revenus-pamc.formulaire.4.remplacant',
							'Rétrocessions d’honoraires perçues'
						)}
					</Condition>
				</H2>
				<AssistantGoal dottedName="déclaration revenus PAMC . SNIR . honoraires remboursables" />
				<AssistantGoal dottedName="déclaration revenus PAMC . SNIR . dépassements honoraires" />
				<AssistantGoal dottedName="déclaration revenus PAMC . SNIR . honoraires tarifs opposables" />
				<AssistantGoal dottedName="déclaration revenus PAMC . SNIR . honoraires hors forfaits" />
				<AssistantGoal
					dottedName="déclaration revenus PAMC . SNIR . taux urssaf"
					originalUnit
				/>

				<Notifications />

				<WhenApplicable dottedName="déclaration revenus PAMC . activité en structures de soins">
					<H2>
						{t(
							'pages.assistants.declaration-revenus-pamc.formulaire.5',
							'Structures de soins'
						)}
					</H2>
				</WhenApplicable>
				<SimpleField dottedName="déclaration revenus PAMC . activité en structures de soins" />
				<AssistantGoal dottedName="déclaration revenus PAMC . activité en structures de soins . recettes" />

				<H2>
					{t(
						'pages.assistants.declaration-revenus-pamc.formulaire.6',
						'Déductions et exonérations'
					)}
				</H2>
				<SimpleField dottedName="déclaration revenus PAMC . déductions et exonérations" />
				<AssistantGoal dottedName="déclaration revenus PAMC . déductions et exonérations . zone déficitaire en offre de soins" />
				<AssistantGoal dottedName="déclaration revenus PAMC . déductions et exonérations . déduction groupe III" />
				<AssistantGoal dottedName="déclaration revenus PAMC . déductions et exonérations . revenus exonérés" />
				<AssistantGoal dottedName="déclaration revenus PAMC . déductions et exonérations . plus-values à court terme" />
				<AssistantGoal dottedName="déclaration revenus PAMC . déductions et exonérations . chèques vacances" />

				<H2>
					{t(
						'pages.assistants.declaration-revenus-pamc.formulaire.7',
						'Autres revenus non salariés'
					)}
				</H2>
				<SimpleField dottedName="déclaration revenus PAMC . autres revenus non salariés" />
				<AssistantGoal dottedName="déclaration revenus PAMC . autres revenus non salariés . plus-values nettes à court terme" />
				<AssistantGoal dottedName="déclaration revenus PAMC . autres revenus non salariés . BIC" />
				<AssistantGoal dottedName="déclaration revenus PAMC . autres revenus non salariés . micro-BIC marchandises" />
				<AssistantGoal dottedName="déclaration revenus PAMC . autres revenus non salariés . micro-BIC service" />
				<AssistantGoal dottedName="déclaration revenus PAMC . autres revenus non salariés . agricole" />
				<AssistantGoal dottedName="déclaration revenus PAMC . autres revenus non salariés . micro-BA" />

				<WhenApplicable dottedName="déclaration revenus PAMC . actes conventionnés uniquement">
					<H2>
						{t(
							'pages.assistants.declaration-revenus-pamc.formulaire.8',
							'Actes conventionnés'
						)}
					</H2>
				</WhenApplicable>
				<SimpleField dottedName="déclaration revenus PAMC . actes conventionnés uniquement" />

				<WhenApplicable dottedName="déclaration revenus PAMC . cotisations facultatives">
					<H2>
						{t(
							'pages.assistants.declaration-revenus-pamc.formulaire.9',
							'Cotisations facultatives'
						)}
					</H2>
				</WhenApplicable>
				<AssistantGoal
					dottedName="déclaration revenus PAMC . cotisations facultatives"
					label={t(
						'pages.assistants.declaration-revenus-pamc.formulaire.10',
						'Montant de vos cotisations facultatives'
					)}
				/>

				<H2>
					{t(
						'pages.assistants.declaration-revenus-pamc.formulaire.11',
						'Revenus de remplacement'
					)}
				</H2>
				<SimpleField dottedName="déclaration revenus PAMC . revenus de remplacement" />
				<AssistantGoal dottedName="déclaration revenus PAMC . revenus de remplacement . IJ" />
				<AssistantGoal dottedName="déclaration revenus PAMC . revenus de remplacement . indemnités incapacité temporaire" />
				<AssistantGoal dottedName="déclaration revenus PAMC . revenus de remplacement . AJPA" />
			</WhenAlreadyDefinedMulti>
		</>
	)
}
