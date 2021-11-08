import { H5 } from 'DesignSystem/typography/heading'
import { Trans } from 'react-i18next'
export function AutoEntrepreneurCard() {
	return (
		<a
			className="ui__ interactive card box lighter-bg"
			href="https://autoentrepreneur.urssaf.fr"
		>
			<Trans i18nKey="gérer.ressources.autoEntrepreneur">
				<H5 as="h3">Accéder au site officiel auto-entrepreneur</H5>
				<p className="ui__ notice">
					Vous pourrez effectuer votre déclaration de chiffre d'affaires, payer
					vos cotisations, et plus largement trouver toutes les informations
					relatives au statut d'auto-entrepreneur
				</p>
			</Trans>
		</a>
	)
}
