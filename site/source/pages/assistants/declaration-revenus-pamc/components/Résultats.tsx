import { Condition } from '@/components/EngineValue/Condition'
import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
import { SimulationValue } from '@/components/Simulation/SimulationValue'
import { Emoji } from '@/design-system/emoji'
import { Container } from '@/design-system/layout'
import { H2, H3 } from '@/design-system/typography/heading'

export default function Résultats() {
	return (
		<WhenAlreadyDefined dottedName="déclaration revenus PAMC . résultats">
			<Container
				forceTheme="dark"
				backgroundColor={(theme) => theme.colors.bases.primary[600]}
			>
				<H2>
					<Emoji emoji="📄" /> Montants à reporter dans votre déclaration de
					revenus
				</H2>

				<SimulationValue
					dottedName="déclaration revenus PAMC . statut"
					label="Situation au 1er janvier ou à la date du début d’activité"
				/>

				<H3>Recettes brutes</H3>
				<SimulationValue
					dottedName="déclaration revenus PAMC . recettes brutes totales"
					label="Recettes brutes totales tirées des activités non salariées"
				/>

				<Condition expression="déclaration revenus PAMC . revenus de remplacement . total">
					<H3>Montant des revenus de remplacement</H3>
				</Condition>
				<SimulationValue
					dottedName="déclaration revenus PAMC . revenus de remplacement . AJPA"
					label="Montant des allocations journalières du proche aidant (AJPA) versées par la CAF"
				/>

				<Condition expression="déclaration revenus PAMC . déductions et exonérations . total déductible">
					<H3>Déductions et exonérations</H3>
				</Condition>
				<SimulationValue
					dottedName="déclaration revenus PAMC . déductions et exonérations . zone déficitaire en offre de soins"
					label="Exonération zone déficitaire en offre de soins"
				/>
				<SimulationValue
					dottedName="déclaration revenus PAMC . déductions et exonérations . chèques vacances"
					label="Chèques vacances déduits du revenu imposable"
				/>

				<H3>Cotisations sociales obligatoires</H3>
				<SimulationValue
					dottedName="déclaration revenus PAMC . cotisations sociales obligatoires"
					label="Cotisations sociales obligatoires déduites du résultat imposable"
				/>

				<H3>Répartition des revenus nets</H3>
				<SimulationValue
					dottedName="déclaration revenus PAMC . revenus nets . revenus conventionnés"
					label="Revenu net de l’activité conventionnée"
				/>
				<SimulationValue
					dottedName="déclaration revenus PAMC . revenus nets . revenus non conventionnés"
					label="Revenus nets tirés des autres activités non salariées"
				/>
				<SimulationValue
					dottedName="déclaration revenus PAMC . revenus nets . revenus structures de soins"
					label="Dont revenus nets de l’activité réalisée dans des structures de soins"
				/>

				<H3>Données transmises par l’Assurance Maladie</H3>
				<SimulationValue dottedName="déclaration revenus PAMC . SNIR . honoraires remboursables" />
				<SimulationValue dottedName="déclaration revenus PAMC . SNIR . dépassements honoraires" />
				<SimulationValue dottedName="déclaration revenus PAMC . SNIR . honoraires tarifs opposables" />
				<SimulationValue dottedName="déclaration revenus PAMC . SNIR . honoraires hors forfaits" />
				<SimulationValue
					dottedName="déclaration revenus PAMC . SNIR . taux urssaf"
					displayedUnit="%"
				/>
			</Container>
		</WhenAlreadyDefined>
	)
}
