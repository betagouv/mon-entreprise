import { useButton } from '@react-aria/button'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Button } from 'DesignSystem/buttons'
import ButtonHelp from 'DesignSystem/buttons/ButtonHelp'
import { CardContainer } from 'DesignSystem/card/Card'
import { Checkbox } from 'DesignSystem/field'
import { Spacing } from 'DesignSystem/layout'
import { Tag } from 'DesignSystem/tag'
import { H4 } from 'DesignSystem/typography/heading'
import { Body, SmallBody } from 'DesignSystem/typography/paragraphs'
import React, { useCallback, useContext, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { debounce } from '../../../../utils'
import { toggleActivité } from '../actions'
import { getTranslatedActivité } from '../activitésData'
import { StoreContext } from '../StoreContext'

type ActiviteCardProps = {
	title: string
	selected?: boolean
	interactive?: boolean
	answered: boolean
	label?: React.ReactNode
	className?: string
}

export const ActiviteCard = ({
	title,
	selected,
	interactive,
	answered,
	label,
}: ActiviteCardProps) => {
	const sitePaths = useContext(SitePathsContext)
	const { dispatch } = useContext(StoreContext)
	const { language } = useTranslation().i18n
	const toggle = useCallback(
		// debounce to avoid double onClick call when clicking on checkbox
		debounce(1, () => {
			selected === undefined ? null : dispatch(toggleActivité(title))
		}),
		[dispatch, selected]
	)
	const { titre, explication, plateformes, icônes } = getTranslatedActivité(
		title,
		language
	)
	const ref = useRef(null)
	const { buttonProps } = useButton(
		{ onPress: toggle, elementType: 'div' },
		ref
	)
	return (
		<CardContainer {...(interactive ? buttonProps : {})} ref={ref}>
			{selected !== undefined && (
				<div
					css={`
						transform: scale(1.15);
						margin-bottom: -1rem;
						margin-left: 0.75rem;
					`}
				>
					<Checkbox
						name={title}
						id={title}
						isSelected={selected}
						excludeFromTabOrder
						onChange={toggle}
						aria-label={titre}
					/>
				</div>
			)}
			<ActiviteContent>
				<H4>{titre}</H4>
				<ButtonHelp title={titre} type="aide">
					<Body>{explication}</Body>
				</ButtonHelp>
				<SmallBody
					css={`
						flex: 1;
					`}
				>
					{plateformes.join(', ')}
				</SmallBody>
				{label && <Tag>{label}</Tag>}
				<BoxIcon>
					<Emoji emoji={icônes} />
				</BoxIcon>
			</ActiviteContent>
			{answered && (
				<>
					<Spacing md />
					<Button
						size="XS"
						light
						onClick={(e) => e.stopPropagation()}
						to={sitePaths.simulateurs.économieCollaborative.index + '/' + title}
					>
						<Trans>Modifier</Trans>
					</Button>
				</>
			)}
		</CardContainer>
	)
}

const BoxIcon = styled.div`
	> img {
		height: ${({ theme }) => theme.spacings.lg} !important;
		width: ${({ theme }) => theme.spacings.lg} !important;
		margin: ${({ theme }) => theme.spacings.xxs} !important;
	}
`

const ActiviteContent = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	text-align: center;
	align-items: center;
	justify-content: stretch;
`
