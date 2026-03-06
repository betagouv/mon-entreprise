import { Trans, useTranslation } from 'react-i18next'

import { FromBottom } from '@/components/ui/animate'
import { Body, Button, H2, Spacing, Strong } from '@/design-system'

export default function CotisationsRégularisation() {
	const { t } = useTranslation()

	return (
		<FromBottom>
			<div>
				<H2 as="h2">
					{t(
						'pages.simulateurs.indépendant.explications.cotisations.régularisation.titre',
						'Comment fonctionne la régularisation des cotisations provisionnelles ?'
					)}
				</H2>
				<Trans i18nKey="pages.simulateurs.indépendant.explications.cotisations.régularisation.description">
					<Body>
						Les cotisations et contributions sont calculées à titre provisionnel
						sur la base du dernier revenu déclaré (ou du montat forfaitaire, si
						aucun revenu n’est encore déclaré). Une fois l’année écoulée et le
						revenu professionnel connu, les cotisations et contributions sont
						régularisées.
					</Body>
					<Body>
						Ce simulateur calcule les cotisations{' '}
						<Strong>après régularisation</Strong>. Il vous permet donc
						d’anticiper le montant de cette régularisation et de planifier votre
						trésorerie en conséquence.
					</Body>
					<Body>
						Si vos revenus d’activité changent beaucoup par rapport à l’année
						précédente, vous avez la possibilité de communiquer à l’Urssaf un{' '}
						<Strong>
							montant prévisionnel pour l’année en cours, qui sera pris comme
							base de calcul
						</Strong>
						(attention cependant, vous serez tenus de faire une estimation
						précise).
					</Body>
				</Trans>

				<Spacing lg />

				<Button
					light
					size="XS"
					href="https://www.urssaf.fr/accueil/independant/comprendre-payer-cotisations/adapter-cotisations-revenus.html"
				>
					{t(
						'pages.simulateurs.indépendant.explications.cotisations.fiche',
						'Voir la fiche Urssaf'
					)}
				</Button>
				<Spacing lg />
			</div>
		</FromBottom>
	)
}
