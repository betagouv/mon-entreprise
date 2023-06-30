import { useCallback, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import { usePersistingState } from '@/components/utils/persistState'
import { NumberField } from '@/design-system'
import { HelpButtonWithPopover } from '@/design-system/buttons'
import { Strong } from '@/design-system/typography'
import { H3 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { batchUpdateSituation } from '@/store/actions/actions'
import { debounce } from '@/utils'

import Layout from './_components/Layout'
import Navigation from './_components/Navigation'

type State = { CA: number | undefined; charges: number | undefined }

export default function Rémunération() {
	const { t } = useTranslation()
	const [{ CA, charges }, setState, reset, isComplete] = useRémunérationState()

	return (
		<>
			<Layout
				title={
					<Trans i18nKey="choix-statut.rémunération.CA.title">
						La première année, j'estime mon chiffre d'affaires à...
						<HelpButtonWithPopover
							title={t(
								'choix-statut.rémunération.CA.help.title',
								'Estimer mon chiffre d’affaire'
							)}
							type="info"
						>
							<Body>
								Le chiffre d’affaires est la{' '}
								<Strong>somme des montants des ventes réalisées pendant</Strong>{' '}
								votre exercice comptable (un an) :{' '}
								<pre>CA = prix de vente × quantités vendues</pre>.
							</Body>
						</HelpButtonWithPopover>
					</Trans>
				}
			>
				<NumberField
					value={CA}
					onChange={(value) => setState({ CA: value })}
					label={t(
						'choix-statut.rémunération.CA.label',
						"Montant du chiffre d'affaires HT"
					)}
					displayedUnit="€/an"
				/>
				<Trans i18nKey="choix-statut.rémunération.charges.title">
					<H3 as="h2">
						J'estime mes charges professionnelles à...
						<HelpButtonWithPopover
							title={t(
								'choix-statut.rémunération.charges.help.title',
								'Définir vos charges professionnelles'
							)}
							type="info"
						>
							<Body>
								Ce sont{' '}
								<Strong>
									toutes les dépenses nécessaires au bon fonctionnement de votre
									entreprise
								</Strong>{' '}
								: expertise-comptable, abonnement téléphonique, abonnement
								internet, mutuelle, prévoyance, outils de travail, etc.
							</Body>
						</HelpButtonWithPopover>
					</H3>
				</Trans>
				<NumberField
					value={charges}
					label={t(
						'choix-statut.rémunération.charges.label',
						'Montant des charges HT'
					)}
					displayedUnit="€/an"
					onChange={(value) => setState({ charges: value })}
				/>

				<Navigation currentStepIsComplete={isComplete} onPreviousStep={reset} />
			</Layout>
		</>
	)
}

function useRémunérationState(): [
	state: State,
	setState: (value: Partial<State>) => void,
	reset: () => void,
	isComplete: boolean
] {
	const defaultState = { CA: undefined, charges: undefined }
	const [state, setState] = usePersistingState<State>(
		'choix-statut:associés',
		defaultState
	)

	const dispatch = useDispatch()
	const debouncedUpdateSituation = useCallback(
		debounce(1000, (newState: State) => {
			dispatch(
				batchUpdateSituation({
					"entreprise . chiffre d'affaires": newState.CA
						? {
								valeur: newState.CA,
								unité: '€/an',
						  }
						: undefined,
					'entreprise . charges': newState.charges
						? { valeur: newState.charges, unité: '€/an' }
						: undefined,
				})
			)
		}),
		[]
	)

	const handleChange = (value: Partial<State>) => {
		const newState = { ...state, ...value }
		setState(newState)
		debouncedUpdateSituation(newState)
	}

	useEffect(() => {
		handleChange(state)
	}, [])
	const reset = () => {
		handleChange(defaultState)
	}

	const engine = useEngine()
	const isComplete =
		engine.evaluate("entreprise . chiffre d'affaires").nodeValue !==
			undefined &&
		engine.evaluate('entreprise . charges').nodeValue !== undefined

	return [state, handleChange, reset, isComplete]
}
