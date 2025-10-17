import * as O from 'effect/Option'
import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { usePersistingState } from '@/components/utils/persistState'
import {
	Body,
	HelpButtonWithPopover,
	Message,
	RadioCard,
	RadioCardGroup,
	SmallBody,
	Strong,
} from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'
import { batchUpdateSituation } from '@/store/actions/actions'

import Layout from './_components/Layout'
import Navigation from './_components/Navigation'

export default function Association() {
	const { t } = useTranslation()
	const [currentSelection, setCurrentSelection, reset, associationPossible] =
		useAssociationSelection()

	return (
		<>
			<Layout
				title={
					<Trans i18nKey="choix-statut.association.title">
						Je crée cette activité...
						<HelpButtonWithPopover
							title={t(
								'choix-statut.association.help.title',
								'L’association, ou organisation à but non lucratif, quèsaco ?'
							)}
							type="info"
						>
							<Body>
								Elle permet de{' '}
								<Strong>
									partager un projet commun dans l’intérêt général, sans faire
									de bénéfices
								</Strong>{' '}
								: promouvoir une activité sportive, l'insertion de personnes en
								difficulté, le développement local, etc...
							</Body>
						</HelpButtonWithPopover>
					</Trans>
				}
			>
				<RadioCardGroup
					aria-label={t(
						'choix-statut.association.question.label',
						'Pourquoi créez vous cette entreprise ?'
					)}
					onChange={setCurrentSelection as (val: string) => void}
					value={currentSelection}
				>
					<RadioCard
						value={'gagner-argent'}
						label={
							<Trans i18nKey="choix-statut.association.question.gagner-argent.label">
								Dans le but de <Strong>gagner de l'argent</Strong>
							</Trans>
						}
					>
						<Body></Body>
					</RadioCard>
					<RadioCard
						value={'non-lucratif'}
						isDisabled={!associationPossible}
						label={
							<Trans i18nKey="choix-statut.association.question.non-lucratif.label">
								Dans un but <Strong>non lucratif</Strong>
							</Trans>
						}
						description={
							associationPossible ? (
								t(
									'choix-statut.association.question.non-lucratif.description.label',
									'Par exemple, en créant une association'
								)
							) : (
								<Message type="info" mini icon>
									<SmallBody>
										<Trans i18nKey="choix-statut.association.question.non-lucratif.description.disabled">
											Cette option n'est pas disponible car votre activité ne
											peut pas être exercée sous forme d’association
										</Trans>
									</SmallBody>
								</Message>
							)
						}
					/>
				</RadioCardGroup>
				<Navigation
					currentStepIsComplete={currentSelection !== undefined}
					onPreviousStep={reset}
					assistantIsCompleted={
						currentSelection === 'non-lucratif' && 'association'
					}
				/>
			</Layout>
		</>
	)
}

type RadioOption = 'gagner-argent' | 'non-lucratif' | undefined

function useAssociationSelection(): [
	RadioOption,
	(value: RadioOption) => void,
	() => void,
	boolean,
] {
	const [{ state: currentSelection }, setCurrentSelection] =
		usePersistingState<{ state: RadioOption }>('choix-statut:association', {
			state: undefined,
		})

	const dispatch = useDispatch()
	const engine = useEngine()

	const associationPossible =
		engine.evaluate('entreprise . catégorie juridique . association')
			.nodeValue !== null

	const handleChange = (value: RadioOption) => {
		setCurrentSelection({ state: value })
		if (!associationPossible) return
		switch (value) {
			case 'gagner-argent':
				dispatch(
					batchUpdateSituation({
						'entreprise . catégorie juridique . association': O.some('non'),
						'entreprise . catégorie juridique': O.none(),
					} as Record<DottedName, O.Option<ValeurPublicodes>>)
				)
				break
			case 'non-lucratif':
				dispatch(
					batchUpdateSituation({
						'entreprise . catégorie juridique . association': O.none(),
						'entreprise . catégorie juridique': O.some('association'),
					} as Record<DottedName, O.Option<ValeurPublicodes>>)
				)
				break
			case undefined:
				dispatch(
					batchUpdateSituation({
						'entreprise . catégorie juridique . association': O.none(),
						'entreprise . catégorie juridique': O.none(),
					} as Record<DottedName, O.Option<ValeurPublicodes>>)
				)
				break
		}
	}

	useEffect(() => {
		handleChange(associationPossible ? currentSelection : 'gagner-argent')
	}, [])
	const reset = () => {
		handleChange(undefined)
	}

	return [currentSelection, handleChange, reset, associationPossible]
}
