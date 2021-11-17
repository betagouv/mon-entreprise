import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Button } from 'DesignSystem/buttons'
import ButtonHelp from 'DesignSystem/buttons/ButtonHelp'
import { CardContainer } from 'DesignSystem/card/Card'
import { Checkbox } from 'DesignSystem/field'
import { Tag } from 'DesignSystem/tag'
import { H4 } from 'DesignSystem/typography/heading'
import { Body, SmallBody } from 'DesignSystem/typography/paragraphs'
import React, { useCallback, useContext } from 'react'
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

	return (
		<CardContainer as={interactive ? 'button' : 'div'} onMouseDown={toggle}>
			{selected !== undefined && (
				<div css="font-size: 1.5rem;">
					<Checkbox
						name={title}
						id={title}
						isSelected={selected}
						aria-label=""
					/>
				</div>
			)}
			<ActiviteContent>
				<H4>{titre}</H4>
				<ButtonHelp title={titre} type="aide">
					<Body>{explication}</Body>
				</ButtonHelp>
				<SmallBody>{plateformes.join(', ')}</SmallBody>
				{label && <Tag>{label}</Tag>}
				<BoxIcon className="box-icon">
					<Emoji emoji={icônes} />
				</BoxIcon>
			</ActiviteContent>
			{answered && (
				<Button
					size="XS"
					light
					onClick={(e) => e.stopPropagation()}
					to={sitePaths.simulateurs.économieCollaborative.index + '/' + title}
				>
					<Trans>Modifier</Trans>
				</Button>
			)}
		</CardContainer>
	)
}

const BoxIcon = styled.div`
	margin: 0.5rem;
`

const ActiviteContent = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	align-items: center;
	justify-content: stretch;
`
