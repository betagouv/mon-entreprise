import { Trans } from 'react-i18next'

import { TrackPage } from '@/components/ATInternetTracking'
import PageHeader from '@/components/PageHeader'
import Warning from '@/components/ui/WarningBlock'
import { Body, Intro, Strong } from '@/design-system'

import Navigation from '../components/Navigation'

export default function Accueil() {
	return (
		<>
			<TrackPage name="accueil" />

			<PageHeader>
				<Trans i18nKey="pages.assistants.cmg.description">
					<Intro>
						Cet outil vous permet d’estimer le montant{' '}
						<Strong>théorique</Strong> du complément transitoire au CMG
						Rémunération.
					</Intro>
				</Trans>
			</PageHeader>

			<Warning localStorageKey="pages.assistants.declaration-revenus-pamc.warning">
				<Body>
					<Trans i18nKey="simulateurs.warning.general">
						<Strong>Les calculs sont indicatifs.</Strong> Ils sont faits à
						partir des éléments que vous avez saisis et des éléments
						réglementaires applicables, mais ils ne tiennent pas compte de
						l’ensemble de votre situation.{' '}
						<Strong>Ils ne se substituent pas aux décomptes réels</Strong> de
						l’Urssaf, de l’administration fiscale ou de tout autre organisme.
					</Trans>
				</Body>
			</Warning>

			<Navigation suivant="informations" />
		</>
	)
}
