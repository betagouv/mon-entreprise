import * as O from 'effect/Option'
import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Commune as CommuneType } from '@/api/commune'
import SelectCommune from '@/components/conversation/select/SelectCommune'
import { usePersistingState } from '@/components/utils/persistState'
import { Body, HelpButtonWithPopover } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'
import {
	batchUpdateSituation,
	enregistreLesRéponses,
} from '@/store/actions/actions'

import Layout from './_components/Layout'
import Navigation from './_components/Navigation'

export default function Commune() {
	const [commune, setCommune, reset, isComplete] = useCommuneSelection()
	const { t } = useTranslation()

	return (
		<>
			<Layout
				title={
					<Trans i18nKey="choix-statut.commune.title">
						Dans quelle commune voulez-vous créer votre entreprise ?
						<HelpButtonWithPopover
							title={t(
								'choix-statut.commune.help.title',
								'Chaque territoire a ses spécificités'
							)}
							type="info"
						>
							<Body>
								Certains dispositifs législatifs sont spécifiques à des régions
								ou départements (Alsace-Moselle, exonération DOM, etc).
							</Body>
							<Body>
								Par ailleurs, certaines communes ont des dispositifs d'aide à la
								création d'entreprise (ZRR, ZFU, etc).
							</Body>
						</HelpButtonWithPopover>
					</Trans>
				}
			>
				<SelectCommune
					onChange={setCommune}
					value={commune && `${commune.nom} (${commune['code postal']})`}
				/>
				<Navigation onPreviousStep={reset} currentStepIsComplete={isComplete} />
			</Layout>
		</>
	)
}

function useCommuneSelection(): [
	state: CommuneType | undefined,
	setState: (c: CommuneType) => void,
	reset: () => void,
	isComplete: boolean,
] {
	const [state, setState] = usePersistingState<{
		commune: CommuneType | undefined
	}>('choix-statut:commune', {
		commune: undefined,
	})

	const dispatch = useDispatch()

	const handleChange = (commune: CommuneType) => {
		setState({ commune })
		dispatch(enregistreLesRéponses('établissement . commune', commune))
	}

	useEffect(() => {
		state.commune &&
			dispatch(enregistreLesRéponses('établissement . commune', state.commune))
	}, [])

	const reset = () => {
		setState({ commune: undefined })
		dispatch(
			batchUpdateSituation({
				'établissement . commune . code postal': O.none(),
				'établissement . commune . département': O.none(),
				'établissement . commune . nom': O.none(),
				'établissement . commune . taux versement mobilité': O.none(),
			} as Record<DottedName, O.Option<ValeurPublicodes>>)
		)
	}

	const isComplete =
		useEngine().evaluate('établissement . commune . nom').nodeValue !==
		undefined

	return [state.commune, handleChange, reset, isComplete]
}
