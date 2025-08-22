import * as O from 'effect/Option'
import { DottedName } from 'modele-social'
import { useCallback, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import { usePersistingState } from '@/components/utils/persistState'
import {
	Body,
	H3,
	HelpButtonWithPopover,
	MontantField,
	Strong,
} from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { eurosParAn, Montant } from '@/domaine/Montant'
import { batchUpdateSituation } from '@/store/actions/actions'
import { debounce } from '@/utils'

import Layout from './_components/Layout'
import Navigation from './_components/Navigation'

export default function Rémunération() {
	const multipleAssociés = useEngine().evaluate(
		'entreprise . associés . multiples'
	).nodeValue

	return multipleAssociés ? (
		<RémunérationSociétéAssociésMultiples />
	) : (
		<RémunérationEntrepriseUnipersonnelle />
	)
}

function RémunérationEntrepriseUnipersonnelle() {
	const { t } = useTranslation()
	const [{ CA, charges }, setState, reset, isComplete] =
		useChiffreAffairesState()

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
				<MontantField
					value={CA}
					unité="€/an"
					onChange={(m) => {
						setState({ CA: m })
					}}
					label={t(
						'choix-statut.rémunération.CA.label',
						"Montant du chiffre d'affaires HT"
					)}
					id="CA"
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
				<MontantField
					value={charges}
					unité="€/an"
					label={t(
						'choix-statut.rémunération.charges.label',
						'Montant des charges HT'
					)}
					onChange={(m) => setState({ charges: m })}
					id="charges"
				/>

				<Navigation currentStepIsComplete={isComplete} onPreviousStep={reset} />
			</Layout>
		</>
	)
}

function RémunérationSociétéAssociésMultiples() {
	const { t } = useTranslation()
	const [{ rémunérationTotale }, setState, reset, isComplete] =
		useRémunérationTotaleState()

	return (
		<>
			<Layout
				title={
					<Trans i18nKey="choix-statut.rémunération.totale.title">
						En tant que dirigeant, je souhaite que l'entreprise me rémunère en
						dépensant au total...
						<HelpButtonWithPopover
							title={t(
								'choix-statut.rémunération.totale.help.title',
								'Rémunération totale du dirigeant'
							)}
							type="info"
						>
							<Body>
								C'est ce que l'entreprise dépense en tout pour la rémunération
								du dirigeant. Cette rémunération "super-brute" inclut toutes les
								cotisations sociales à payer. On peut aussi considérer que c'est
								la valeur monétaire du travail du dirigeant.
							</Body>
						</HelpButtonWithPopover>
					</Trans>
				}
			>
				<MontantField
					value={
						rémunérationTotale !== undefined
							? eurosParAn(rémunérationTotale)
							: undefined
					}
					unité="€/an"
					onChange={(m) => setState({ rémunérationTotale: m?.valeur })}
					label={t(
						'choix-statut.rémunération.rémunérationTotale.label',
						'Montant de la rémunération totale'
					)}
					id="rémunérationTotale"
				/>

				<Navigation currentStepIsComplete={isComplete} onPreviousStep={reset} />
			</Layout>
		</>
	)
}

type CAState = {
	CA: Montant<'€/an'> | undefined
	charges: Montant<'€/an'> | undefined
}
function useChiffreAffairesState(): [
	state: CAState,
	setState: (value: Partial<CAState>) => void,
	reset: () => void,
	isComplete: boolean,
] {
	const defaultState = { CA: undefined, charges: undefined }
	const [state, setState] = usePersistingState<CAState>(
		'choix-statut:associés',
		defaultState
	)

	const dispatch = useDispatch()
	const debouncedUpdateSituation = useCallback(
		debounce(1000, (newState: CAState) => {
			dispatch(
				batchUpdateSituation({
					"entreprise . chiffre d'affaires": O.some(newState.CA),
					'entreprise . charges': O.some(newState.charges),
					'dirigeant . rémunération . totale': O.none(),
				} as Record<DottedName, O.Option<ValeurPublicodes>>)
			)
		}),
		[]
	)

	const handleChange = (value: Partial<CAState>) => {
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

type RémunérationState = { rémunérationTotale: number | undefined }
function useRémunérationTotaleState(): [
	state: RémunérationState,
	setState: (value: Partial<RémunérationState>) => void,
	reset: () => void,
	isComplete: boolean,
] {
	const defaultState = { rémunérationTotale: undefined }
	const [state, setState] = usePersistingState<RémunérationState>(
		'choix-statut:associés',
		defaultState
	)

	const dispatch = useDispatch()
	const debouncedUpdateSituation = useCallback(
		debounce(1000, (newState: RémunérationState) => {
			dispatch(
				batchUpdateSituation({
					"entreprise . chiffre d'affaires": O.none(),
					'entreprise . charges': O.none(),
					'dirigeant . rémunération . totale': O.fromNullable(
						newState.rémunérationTotale
					),
				} as Record<DottedName, O.Option<ValeurPublicodes>>)
			)
		}),
		[]
	)

	const handleChange = (value: Partial<RémunérationState>) => {
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
		engine.evaluate('dirigeant . rémunération . totale').nodeValue !== undefined

	return [state, handleChange, reset, isComplete]
}
