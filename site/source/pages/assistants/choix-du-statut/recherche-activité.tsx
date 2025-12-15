import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Body, H5, HelpButtonWithPopover, Link, Message } from '@/design-system'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { enregistreLaRéponse, resetSimulation } from '@/store/actions/actions'

import SearchCodeAPE from '../recherche-code-ape/SearchCodeAPE'
import Layout from './_components/Layout'
import Navigation from './_components/Navigation'
import useIsEmbededOnBPISite from './_components/useIsEmbededBPI'

export default function RechercheActivité() {
	const [codeApe, setCodeApe] = useState('')
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const isEmbedded = useIsEmbedded()
	useEffect(() => {
		dispatch(resetSimulation())
	}, [])

	const isBpi = useIsEmbededOnBPISite()

	const NavigationComponent = (
		<Navigation
			small={!!codeApe && isEmbedded}
			currentStepIsComplete={!!codeApe}
			onNextStep={() => {
				dispatch(
					enregistreLaRéponse(
						'entreprise . activités . principale . code APE',
						codeApe
					)
				)
			}}
		/>
	)

	return (
		<>
			<Layout
				title={
					<Trans i18nKey={'choix-statut.activité.title'}>
						Mon activité principale est…
						<HelpButtonWithPopover
							title={t(
								'choix-statut.activité.help.title',
								'Le choix du statut, un choix adapté à votre situation'
							)}
							type="info"
						>
							<Body>
								Le choix du statut et les cotisations diffèrent en fonction de
								l'activité professionnelle que vous exercez. Renseigner votre
								métier vous donnera de la visibilité sur les statuts possibles
								et permettra de simuler vos revenus de manière plus précise.
							</Body>
							<Message type="secondary" border={false}>
								<H5 as="h3">Vous cumulez plusieurs activités ?</H5>
								<Body>
									Votre entreprise doit tout de même déclarer une activité
									principale à l'administration. Pour savoir comment la
									déterminer,{' '}
									<Link
										href={
											isBpi
												? 'https://bpifrance-creation.fr/encyclopedie/statut-du-dirigeant-son-conjoint/situation-pluriactifs/cumul-dactivites-independantes#:~:text=Il%20est%20en%20g%C3%A9n%C3%A9ral%20possible,d%27entre%20elles%20est%20agricole.'
												: 'https://entreprendre.service-public.fr/vosdroits/F33050'
										}
									>
										voir ce guide
									</Link>
									.
								</Body>
							</Message>
						</HelpButtonWithPopover>
					</Trans>
				}
			>
				<SearchCodeAPE
					hideGuichetUnique
					onCodeAPESelected={setCodeApe}
					underSelection={isEmbedded ? NavigationComponent : null}
				/>
				{(!codeApe || !isEmbedded) && NavigationComponent}
			</Layout>
		</>
	)
}
