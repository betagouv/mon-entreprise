import { AssistantGoal } from '@/components/Assistant/AssistantGoal'
import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
import { WhenAlreadyDefinedMulti } from '@/components/EngineValue/WhenAlreadyDefinedMulti'
import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { H2 } from '@/design-system/typography/heading'

import { SimpleField } from '../../components/Fields'

export default function Formulaire() {
	return (
		<>
			<H2>Profession</H2>
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
				<H2>Recettes</H2>
				<AssistantGoal dottedName="déclaration revenus PAMC . recettes brutes totales" />
				<AssistantGoal dottedName="déclaration revenus PAMC . revenus imposables" />
				<AssistantGoal dottedName="déclaration revenus PAMC . cotisations sociales obligatoires" />

				<H2>Données du relevé SNIR</H2>
				<AssistantGoal dottedName="déclaration revenus PAMC . SNIR . honoraires remboursables" />
				<AssistantGoal dottedName="déclaration revenus PAMC . SNIR . dépassements honoraires" />
				<AssistantGoal dottedName="déclaration revenus PAMC . SNIR . honoraires tarifs opposables" />
				<AssistantGoal dottedName="déclaration revenus PAMC . SNIR . honoraires hors forfaits" />
				<AssistantGoal
					dottedName="déclaration revenus PAMC . SNIR . taux urssaf"
					originalUnit
				/>

				<WhenApplicable dottedName="déclaration revenus PAMC . activité en structures de soins">
					<H2>Structures de soins</H2>
				</WhenApplicable>
				<SimpleField dottedName="déclaration revenus PAMC . activité en structures de soins" />
				<AssistantGoal dottedName="déclaration revenus PAMC . activité en structures de soins . recettes" />

				<H2>Déductions et exonérations</H2>
				<SimpleField dottedName="déclaration revenus PAMC . déductions et exonérations" />
				<AssistantGoal dottedName="déclaration revenus PAMC . déductions et exonérations . zone déficitaire en offre de soins" />
				<AssistantGoal dottedName="déclaration revenus PAMC . déductions et exonérations . revenus exonérés" />
				<AssistantGoal dottedName="déclaration revenus PAMC . déductions et exonérations . plus-values à court terme" />
				<AssistantGoal dottedName="déclaration revenus PAMC . déductions et exonérations . chèques vacances" />

				<H2>Autres revenus non salariés</H2>
				<SimpleField dottedName="déclaration revenus PAMC . autres revenus non salariés" />
				<AssistantGoal dottedName="déclaration revenus PAMC . autres revenus non salariés . plus-values nettes à court terme" />
				<AssistantGoal dottedName="déclaration revenus PAMC . autres revenus non salariés . vente de marchandises" />
				<AssistantGoal dottedName="déclaration revenus PAMC . autres revenus non salariés . prestation de service" />
				<AssistantGoal dottedName="déclaration revenus PAMC . autres revenus non salariés . agricole" />

				<WhenApplicable dottedName="déclaration revenus PAMC . actes conventionnés uniquement">
					<H2>Actes conventionnés</H2>
				</WhenApplicable>
				<SimpleField dottedName="déclaration revenus PAMC . actes conventionnés uniquement" />

				<H2>Revenus de remplacement</H2>
				<SimpleField dottedName="déclaration revenus PAMC . revenus de remplacement" />
				<AssistantGoal dottedName="déclaration revenus PAMC . revenus de remplacement . AJPA" />
			</WhenAlreadyDefinedMulti>
		</>
	)
}
