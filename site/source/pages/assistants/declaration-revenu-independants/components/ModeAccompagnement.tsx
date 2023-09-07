import { useCallback } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { css, styled } from 'styled-components'

import { useEngine } from '@/components/utils/EngineContext'
import { Message } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { Switch } from '@/design-system/switch'
import { Strong } from '@/design-system/typography'
import { H3 } from '@/design-system/typography/heading'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'
import { useOrdinal } from '@/hooks/useOrdinal'
import { updateSituation } from '@/store/actions/actions'

export default function ModeAccompagnement() {
	const engine = useEngine()

	const declarationNumber = engine.evaluate('DRI . nombre de déclarations')
		.nodeValue as number

	const defaultAccompagnementMode = engine.evaluate(
		'DRI . accompagnement imposition par défaut'
	).nodeValue as boolean

	const isSelected = engine.evaluate('DRI . accompagnement imposition')
		.nodeValue as boolean

	const dispatch = useDispatch()
	const imposition = engine.evaluate('entreprise . imposition')
	if (isSelected && Object.keys(imposition.missingVariables).length > 0) {
		dispatch(
			updateSituation(
				'entreprise . imposition',
				`'${imposition.nodeValue as string}'`
			)
		)
	}

	const updateSelected = useCallback(
		(isSelected: boolean) =>
			dispatch(
				updateSituation(
					'DRI . accompagnement imposition',
					isSelected ? 'oui' : 'non'
				)
			),
		[dispatch]
	)

	return (
		<Message>
			<H3>{engine.getRule('DRI . accompagnement imposition').title}</H3>
			<Body>
				<Strong>
					<Trans i18nKey="assistant-DRI.imposition.mode-accompagnement.nombre-déclarations">
						C'est votre {{ nthDeclaration: useOrdinal(declarationNumber) }}{' '}
						déclaration de revenu depuis la création de votre entreprise.
					</Trans>
				</Strong>{' '}
			</Body>
			{defaultAccompagnementMode ? (
				<Trans i18nKey="assistant-DRI.imposition.mode-accompagnement.activé">
					<Body>
						Tout n'est peut-être pas encore très clair pour vous. Nous allons
						vous guider pas à pas en vous posant des questions simples. À chaque
						fois, nous vous donnerons des pistes sur comment trouver les
						informations pour y répondre.
					</Body>
					<Body>
						Nous vous expliquerons aussi toutes les notions clés reliées à votre
						déclaration (par exemple : IS/IR, BIC, BNC, liasse fiscale, etc.)
					</Body>
					<Body>
						Vous pouvez changer de mode à tout moment en utilisant
						l'interrupteur ci-dessous.{' '}
					</Body>
				</Trans>
			) : (
				<Trans i18nKey="assistant-DRI.imposition.mode-accompagnement.désactivé">
					<Body>
						Vous avez peut-être une bonne connaissance des notions associées
						(par exemple : IS/IR, BIC/BNC, liasse fiscale, etc.). Nous irons
						droit au but en vous posant des{' '}
						<Strong>questions simples et précises</Strong> pour vous faire
						gagner du temps.{' '}
					</Body>
					<Body>
						Si vous souhaitez être davantage accompagné pour répondre aux
						questions, vous pouvez <Strong>changer de mode</Strong> à tout
						moment en utilisant l'interrupteur ci-dessous.
					</Body>
				</Trans>
			)}
			<Spacing xs />
			<AccompagnementSwitch>
				<Switch onChange={updateSelected} defaultSelected={isSelected}>
					<Strong>
						<Trans>Mode accompagnement</Trans>
					</Strong>
				</Switch>
				<SmallBody>
					{isSelected ? (
						<Trans>Accompagnement activé</Trans>
					) : (
						<Trans>Accompagnement désactivé</Trans>
					)}
				</SmallBody>
			</AccompagnementSwitch>
		</Message>
	)
}

const AccompagnementSwitch = styled.div`
	${({ theme }) => css`
		background-color: ${theme.colors.extended.grey[100]};
		padding: ${theme.spacings.md};
		padding-bottom: 0;
		display: flex;
		flex-direction: column;
		border-radius: ${theme.box.borderRadius};
		width: fit-content;
		margin-bottom: ${theme.spacings.md};
		* {
			color: ${theme.colors.bases.primary[800]};
		}
	`}
`
