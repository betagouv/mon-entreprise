import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Message } from '@/design-system'
import { HelpButtonWithPopover } from '@/design-system/buttons'
import { H5 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { updateSituation } from '@/store/actions/actions'

import SearchCodeAPE from '../recherche-code-ape/SearchCodeAPE'
import Layout from './_components/Layout'
import Navigation from './_components/Navigation'

export default function RechercheActivité() {
	const [codeApe, setCodeApe] = useState('')
	const { t } = useTranslation()
	const dispatch = useDispatch()

	return (
		<>
			<Layout
				title={
					<Trans i18nKey={'choix-statut.activité.title'}>
						Mon activité principale est...
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
									<Link href="https://entreprendre.service-public.fr/vosdroits/F33050">
										voir ce guide
									</Link>
									.
								</Body>
							</Message>
						</HelpButtonWithPopover>
					</Trans>
				}
			>
				<SearchCodeAPE hideGuichetUnique onCodeAPESelected={setCodeApe} />
				<Navigation
					currentStepIsComplete={!!codeApe}
					onNextStep={() => {
						console.log('yaaaaaay')
						dispatch(
							updateSituation(
								'entreprise . activités . principale . code APE',
								`'${codeApe}'`
							)
						)
					}}
				/>
			</Layout>
		</>
	)
}
