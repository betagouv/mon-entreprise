import { Trans, useTranslation } from 'react-i18next'

import { ACCUEIL, TrackPage } from '@/components/ATInternetTracking'
import Warning from '@/components/ui/WarningBlock'
import { Body, Button, Strong } from '@/design-system'
import { useGetPath } from '@/hooks/useGetPath'

export default function Accueil() {
	const { t } = useTranslation()
	const getPath = useGetPath()

	return (
		<>
			<TrackPage name={ACCUEIL} />

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

			<Button size="XS" to={getPath('assistants.cmg.informations')}>
				{t('pages.assistants.cmg.démarrer', 'Démarrer une simulation')}
			</Button>
		</>
	)
}
