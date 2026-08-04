import { Trans, useTranslation } from 'react-i18next'

import { StatutTag } from '@/components/StatutTag'
import { useComparateur } from '@/contextes/comparateur'
import { Grid, H4, Li, StatusCard, Strong, Ul } from '@/design-system'

export const CartesStatuts = () => {
	const { comparaison } = useComparateur()

	return (
		<Grid container spacing={4} as={Ul}>
			{comparaison.map((résultatModèle, index) => (
				<Grid item xs={12} lg={12 / comparaison.length} as="li" key={index}>
					<CarteStatut statut={résultatModèle.statut} />
				</Grid>
			))}
		</Grid>
	)
}

type Props = {
	statut: ReturnType<typeof useComparateur>['comparaison'][number]['statut']
}
const CarteStatut = ({ statut }: Props) => {
	const { situation } = useComparateur()
	const { t } = useTranslation()

	return (
		<StatusCard>
			<StatusCard.Étiquette>
				<StatutTag statut={statut.étiquette} />
			</StatusCard.Étiquette>
			<StatusCard.Titre>
				<H4 as="h3">{statut.nom}</H4>
			</StatusCard.Titre>
			<StatusCard.Action>
				<Ul>
					<Li>{statut.imposition()}</Li>
					<Li>{statut.régime(t)}</Li>
					<Li>
						{situation.acre ? (
							<Trans i18nkey="pages.simulateurs.comparaison-statuts.carte.acre.oui">
								Option <Strong>Acre</Strong> activée
							</Trans>
						) : (
							t(
								'pages.simulateurs.comparaison-statuts.carte.acre.non',
								'Option Acre non activée'
							)
						)}
					</Li>
				</Ul>
			</StatusCard.Action>
		</StatusCard>
	)
}
