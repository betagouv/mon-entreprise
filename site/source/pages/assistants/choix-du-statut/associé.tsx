import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { FromTop } from '@/components/ui/animate'
import { usePersistingState } from '@/components/utils/persistState'
import {
	Message,
	Radio,
	RadioCard,
	RadioCardGroup,
	ToggleGroup,
} from '@/design-system'
import { HelpButtonWithPopover } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H3, H4 } from '@/design-system/typography/heading'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { batchUpdateSituation } from '@/store/actions/actions'

import Layout from './_components/Layout'
import Navigation from './_components/Navigation'

type State = {
	question1: 'seul' | 'plusieurs' | undefined
	question2: 'oui' | 'non' | undefined
	question3: 'oui' | 'non' | undefined
}

export default function Associés() {
	const { t } = useTranslation()

	const [{ question1, question2, question3 }, setState, reset, isComplete] =
		useAssociésSelection()

	return (
		<>
			<Layout
				title={
					<Trans i18nKey="choix-statut.associés.title">
						Je gère cette entreprise...
						<HelpButtonWithPopover
							title={t(
								'choix-statut.associés.help.title',
								'Être plusieurs associé(e)s ou actionnaires'
							)}
							type="info"
						>
							<Body>
								Vous <Strong>partagez la propriété de votre entreprise </Strong>
								avec d’autres personnes qui peuvent être{' '}
								<Strong>physiques</Strong> (individus) ou{' '}
								<Strong>morales</Strong> (sociétés).
							</Body>
							<Body>
								Dans le cas des <Strong>sociétés par actions</Strong> (SASU,
								SAS), on parle d’
								<Strong>actionnaires</Strong>.
							</Body>
						</HelpButtonWithPopover>
					</Trans>
				}
			>
				<RadioCardGroup
					aria-label={t(
						'choix-statut.associés.question1.label',
						'Comment gérez-vous cette entreprise ?'
					)}
					onChange={(value) =>
						setState({ question1: value as State['question1'] })
					}
					value={question1}
				>
					<RadioCard
						value={'seul'}
						label={
							<Trans i18nKey="choix-statut.associés.question1.seul">Seul</Trans>
						}
					/>
					<RadioCard
						value={'plusieurs'}
						label={
							<Trans i18nKey="choix-statut.associés.question1.plusieurs">
								À plusieurs
							</Trans>
						}
					/>
				</RadioCardGroup>
				{question1 === 'seul' && (
					<FromTop>
						<Spacing md />
						<Message type="secondary" border={false}>
							<H4 as="h3" id="question2">
								<Trans i18nKey="choix-statut.associés.question2">
									Envisagez-vous d’ajouter des associé(e)s dans un second temps
									?
								</Trans>
							</H4>
							<ToggleGroup
								aria-labelledby="question2"
								onChange={(value) =>
									setState({ question2: value as State['question2'] })
								}
								value={question2}
							>
								<Radio value={'oui'}>
									<Trans>Oui</Trans>
								</Radio>
								<Radio value={'non'}>
									<Trans>Non</Trans>
								</Radio>
							</ToggleGroup>
							<Spacing md />
						</Message>
					</FromTop>
				)}
				{question2 === 'non' && question1 === 'seul' && (
					<FromTop>
						<Spacing md />
						<Message type="secondary" border={false}>
							<H4 as="h3" id="question3">
								<Trans i18nKey="choix-statut.associés.question3.label">
									Voulez-vous exercer votre activité sous la forme d'une société
									uniquement ?
									<HelpButtonWithPopover
										title={t(
											'choix-statut.associés.question3.help.title',
											'Choisir entre une entreprise individuelle et une société'
										)}
										type="info"
									>
										<H3>Entreprise individuelle</H3>
										<Ul>
											<Li>
												Vous êtes{' '}
												<Strong>
													responsable sur l'ensemble de vos biens utiles à votre
													activité
												</Strong>{' '}
												(matériel, locaux, outils, etc.).{' '}
											</Li>
											<Li>
												Votre{' '}
												<Strong>patrimoine personnel peut être saisi</Strong> en
												cas de manquements à vos obligations fiscales et
												sociales.
											</Li>
											<Li>
												Vous pouvez{' '}
												<Strong>
													renoncer à la séparation de ses patrimoines
												</Strong>
												, par exemple pour garantir un crédit bancaire.
											</Li>
											<Li>
												Les formalités de création et de gestion sont{' '}
												<Strong>plus simples et moins coûteuses.</Strong>
											</Li>
										</Ul>
										<H3>Société</H3>
										<Ul>
											<Li>
												Vous êtes uniquement{' '}
												<Strong>
													responsable sur le montant de votre apport au capital
													social
												</Strong>{' '}
												et des biens détenus par la société.
											</Li>
											<Li>
												Les formalités de création et de gestion sont{' '}
												<Strong>plus complexes et plus coûteuses</Strong>.
											</Li>
										</Ul>
									</HelpButtonWithPopover>
								</Trans>
							</H4>
							<ToggleGroup
								aria-labelledby="question3"
								onChange={(value) =>
									setState({ question3: value as State['question3'] })
								}
								value={question3}
							>
								<Radio value={'oui'}>
									<Trans>Oui</Trans>
								</Radio>
								<Radio value={'non'}>
									<Trans>Non</Trans>
								</Radio>
							</ToggleGroup>
							<Spacing md />
						</Message>
					</FromTop>
				)}
				{question1 === 'plusieurs' && (
					<FromTop>
						<Spacing lg />
						<Message type="info" icon>
							<Body>
								<Trans i18nKey="choix-statut.associés.plusieurs.avertissement">
									Cet assistant ne gère pas encore le cas des gérant associés
									égalitaire ou minoritaire. Il s'adresse uniquement aux
									personnes possédant <Strong>au minimum 51 % des parts</Strong>{' '}
									de leur entreprise.
								</Trans>
							</Body>
						</Message>
					</FromTop>
				)}

				<Navigation currentStepIsComplete={isComplete} onPreviousStep={reset} />
			</Layout>
		</>
	)
}

function useAssociésSelection(): [
	state: State,
	setState: (value: Partial<State>) => void,
	reset: () => void,
	isComplete: boolean,
] {
	const [state, setState] = usePersistingState<State>('choix-statut:associés', {
		question1: undefined,
		question2: undefined,
		question3: undefined,
	})

	const dispatch = useDispatch()

	const handleChange = (value: Partial<State>) => {
		const newState = { ...state, ...value }
		setState(newState)
		dispatch(
			batchUpdateSituation({
				'entreprise . associés':
					newState.question1 === 'seul'
						? "'unique'"
						: newState.question1 === 'plusieurs'
						? "'multiples'"
						: undefined,

				'entreprise . catégorie juridique . EI':
					newState.question2 === 'oui' || newState.question3 === 'oui'
						? 'non'
						: undefined,
			})
		)
	}

	useEffect(() => {
		handleChange(state)
	}, [])
	const reset = () => {
		handleChange({
			question1: undefined,
			question2: undefined,
			question3: undefined,
		})
	}

	const isComplete =
		state.question1 === 'plusieurs' ||
		state.question2 === 'oui' ||
		!!state.question3

	return [state, handleChange, reset, isComplete]
}
