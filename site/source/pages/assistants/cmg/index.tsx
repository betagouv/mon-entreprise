import { Trans } from 'react-i18next'

import PageHeader from '@/components/PageHeader'
import Warning from '@/components/ui/WarningBlock'
import { CMGProvider } from '@/contextes/cmg'
import { Body, Intro, Strong } from '@/design-system'

import AMA from './components/AMA/AMA'
import EnfantsÀCharge from './components/enfants-à-charge/EnfantsÀCharge'
import GED from './components/GED/GED'
import QuestionRessources from './components/QuestionRessources'
import Résultats from './components/Résultats/Résultats'

const CMG = () => {
	return (
		<>
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

			<QuestionRessources />

			<EnfantsÀCharge />

			<GED />
			<AMA />

			<Résultats />
		</>
	)
}

const CMGWithProvider = () => (
	<CMGProvider>
		<CMG />
	</CMGProvider>
)

export default CMGWithProvider
