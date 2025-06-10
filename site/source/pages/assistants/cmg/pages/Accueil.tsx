import { Trans, useTranslation } from 'react-i18next'

import { TrackPage } from '@/components/ATInternetTracking'
import PageHeader from '@/components/PageHeader'
import Warning from '@/components/ui/WarningBlock'
import { Body, Intro, Link, Strong } from '@/design-system'

import Navigation from '../components/Navigation'

export default function Accueil() {
	const { t } = useTranslation()

	return (
		<>
			<TrackPage name="accueil" />

			<PageHeader>
				<Trans i18nKey="pages.assistants.cmg.description">
					<Intro>
						La réforme du mode de calcul du CMG peut entraîner une diminution du
						montant de votre prestation (voir le simulateur{' '}
						<Link
							href="https://www.urssaf.fr/accueil/outils-documentation/simulateurs/calculer-reste-a-charge-cmg-particulier-employeur.html"
							target="_blank"
							aria-label={t(
								'pages.assistants.cmg.simulateur-1.aria-label',
								'Aller sur la page "Évaluez votre reste à charge" sur urssaf.fr, nouvelle fenêtre.'
							)}
						>
							Évaluez votre reste à charge
						</Link>
						). Dans ce cas, vous pouvez bénéficier d’un complément transitoire
						si vous remplissez les conditions.
						<br />
						Cet outil vous permet d’estimer si vous avez droit à ce complément
						et si oui, quel sera son montant <Strong>à titre indicatif</Strong>.
					</Intro>
				</Trans>
			</PageHeader>

			<Warning localStorageKey="pages.assistants.cmg.warning">
				<Trans i18nKey="assistants.warning.cmg">
					<Body>
						<Strong>Les calculs sont indicatifs.</Strong> Ils sont faits à
						partir des éléments que vous avez saisis et des éléments
						réglementaires applicables, mais ils ne tiennent pas compte de
						l’ensemble de votre situation.
						<br />
						Ils n’ont pas de valeur contractuelle et ne peuvent engager la
						responsabilité de l’Urssaf, de la Caf ou de la MSA.
					</Body>
					<Body>Aucun élément de cette simulation ne sera conservé.</Body>
					<Body>
						<Strong>De quoi avez-vous besoin&nbsp;?</Strong> De votre revenu
						fiscal 2023, ainsi que du nombre d’heures de garde, du montant des
						rémunérations et du CMG perçu pour les mois de mars, avril et mai
						2025, pour chacune de vos salariées.
					</Body>
				</Trans>
			</Warning>

			<Navigation suivant="informations" />
		</>
	)
}
