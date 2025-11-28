import { Trans, useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import CotisationsUrssaf from '@/components/simulationExplanation/InstitutionsPartenaires/CotisationsUrssaf'

type Props = {
	role?: string
}

export default function CotisationsUrssafArtisteAuteur({ role }: Props) {
	const { t } = useTranslation()

	return (
		<CotisationsUrssaf
			rule="artiste-auteur . cotisations"
			extraNotice={
				<Condition expression="artiste-auteur . revenus . traitements et salaires > 0">
					{t(
						'pages.simulateurs.artiste-auteur.explications.cotisations.précompte',
						'Pour vos revenus en traitement et salaires, ces cotisations sont « précomptées », c’est-à-dire payées à la source par le diffuseur.'
					)}
				</Condition>
			}
			role={role}
		>
			<Trans i18nKey="pages.simulateurs.artiste-auteur.explications.institutions.urssaf">
				L’Urssaf recouvre les cotisations servant au financement de la sécurité
				sociale (assurance maladie, allocations familiales, dépendance et
				retraite{' '}
				{/* IRCEC recouvre les cotisations de retraite complémentaire pour les artistes-auteurs */}
				<Condition expression="artiste-auteur . cotisations > 0">
					{' '}
					de base
				</Condition>
				).
			</Trans>
		</CotisationsUrssaf>
	)
}
