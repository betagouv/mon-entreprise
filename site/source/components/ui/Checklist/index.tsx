import { Grid } from '@mui/material'
import { Markdown } from 'Components/utils/markdown'
import { ScrollToElement } from 'Components/utils/Scroll'
import { Checkbox } from 'DesignSystem/field'
import { Spacing } from 'DesignSystem/layout'
import { Link } from 'DesignSystem/typography/link'
import React, { useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'

type CheckItemProps = {
	title: string
	name: string
	explanations?: React.ReactNode
	onChange?: (isSelected: boolean) => void
	defaultChecked?: boolean
}

const CheckItemHeader = styled.div`
	display: flex;
	width: 100%;
	align-items: flex-start;
`

export function CheckItem({
	title,
	name,
	explanations,
	onChange,
	defaultChecked,
}: CheckItemProps) {
	const [displayExplanations, setDisplayExplanations] = useState(false)

	const handleChecked = (isSelected: boolean) => {
		if (isSelected) {
			setDisplayExplanations(false)
		}
		onChange?.(isSelected)
	}

	const handleClick = () => {
		setDisplayExplanations(!displayExplanations)
	}

	return (
		<ScrollToElement
			onlyIfNotVisible
			when={displayExplanations}
			style={{ width: '100%' }}
		>
			<CheckItemHeader>
				<Checkbox
					name={name}
					onChange={handleChecked}
					defaultSelected={defaultChecked}
					label={title}
				/>

				{explanations && (
					<StyledLink onPress={handleClick}>
						{displayExplanations ? (
							<Trans i18nKey="checklist.showmore.open">
								Masquer les détails
							</Trans>
						) : (
							<Trans i18nKey="checklist.showmore.closed">En savoir plus</Trans>
						)}
					</StyledLink>
				)}
			</CheckItemHeader>
			{displayExplanations && explanations && (
				<Grid
					item
					xs={11}
					sm={10}
					md={8}
					lg={6}
					css={`
						margin-left: 2rem;
					`}
				>
					{typeof explanations === 'string' ? (
						<Markdown>{explanations}</Markdown>
					) : (
						explanations
					)}
					<Spacing lg />
				</Grid>
			)}
		</ScrollToElement>
	)
}

const StyledLink = styled(Link)`
	margin: ${({ theme }) => theme.spacings.sm} 0;
	margin-left: ${({ theme }) => theme.spacings.xs};
	white-space: nowrap;
`
export type ChecklistProps = {
	children: React.ReactNode
	onItemCheck?: (name: string, isChecked: boolean) => void
	onInitialization?: (arg: Array<string>) => void
	defaultChecked?: { [key: string]: boolean }
}
export function Checklist({
	children,
	onItemCheck,
	onInitialization,
	defaultChecked,
}: ChecklistProps) {
	const checklist = React.Children.toArray(children)
		.filter(Boolean)
		.map((child) => {
			if (!React.isValidElement(child)) {
				throw new Error('Invalid child passed to Checklist')
			}
			return React.cloneElement(child, {
				onChange: (isSelected: boolean) =>
					onItemCheck?.(child.props.name, isSelected),
				defaultChecked:
					child.props.defaultChecked || defaultChecked?.[child.props.name],
			})
		})

	useEffect(() => {
		onInitialization?.(checklist.map((child) => child.props.name))
	}, [])

	return (
		<StyledList>
			{checklist.map((checkItem) => (
				<StyledListItem key={checkItem.props.name}>{checkItem}</StyledListItem>
			))}
		</StyledList>
	)
}

const StyledList = styled.ul`
	padding-left: 1rem;
	font-family: ${({ theme }) => theme.fonts.main};
`

const StyledListItem = styled.li`
	list-style: none;
`
