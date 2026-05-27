'use client'

import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Body, Button, H1, H2 } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useDarkMode } from '@/hooks/useDarkMode'
import { simulationSourceSelector } from '@/store/selectors/simulationSource.selector'
import {
	fermeLeBandeau,
	simulationChargéeDepuisLien,
} from '@/store/slices/simulationSource.slice'

const règleObsolèteDémo =
	'dirigeant . auto-entrepreneur . Acre' satisfies DottedName

export default function Home() {
	const { t } = useTranslation()
	const [darkMode, setDarkMode] = useDarkMode()
	const dispatch = useDispatch()
	const simulationSource = useSelector(simulationSourceSelector)

	return (
		<main>
			<H1>{t('app.titre', 'Mon entreprise — Next.js')}</H1>
			<Body>
				{t(
					'app.description',
					'Migration en cours. Cette page confirme que Next.js et le design-system sont correctement configurés.'
				)}
			</Body>
			<Button onPress={() => setDarkMode(!darkMode)}>
				{darkMode
					? t('app.basculerLight', 'Basculer en mode light')
					: t('app.basculerDark', 'Basculer en mode dark')}
			</Button>
			<H2>Démo Redux</H2>
			<Body>
				État du sélecteur <code>simulationSourceSelector</code> :{' '}
				<code>{JSON.stringify(simulationSource)}</code>
			</Body>
			<Button
				onPress={() =>
					dispatch(simulationChargéeDepuisLien([règleObsolèteDémo]))
				}
			>
				Déclencher simulationChargéeDepuisLien
			</Button>{' '}
			<Button onPress={() => dispatch(fermeLeBandeau())}>
				Déclencher fermeLeBandeau
			</Button>
		</main>
	)
}
