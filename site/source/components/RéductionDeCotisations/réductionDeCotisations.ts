import { styled } from 'styled-components'

import { Body, Radio, ToggleGroup } from '@/design-system'

export const SwitchContainer = styled.div.withConfig({
	shouldForwardProp: (prop) => prop !== 'isRule',
})<{ isRule?: boolean }>`
	text-align: left;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	column-gap: ${({ theme }) => theme.spacings.sm};
	width: 100%;
	margin-bottom: ${({ isRule, theme }) =>
		isRule ? `-${theme.spacings.lg}` : theme.spacings.sm};
`
export const SwitchLabel = styled(Body).withConfig({
	shouldForwardProp: (prop) => prop !== 'isRule',
})<{ isRule?: boolean }>`
	margin: 0;
	margin-bottom: ${({ isRule, theme }) => theme.spacings[isRule ? 'md' : 'sm']};
	font-weight: 700;
`
export const RuleSwitchLabel = styled(SwitchLabel).attrs({
	isRule: true,
})``
export const SwitchToggleGroup = styled(ToggleGroup)`
	display: flex;
	> * {
		display: flex;
	}
`
export const SwitchRadio = styled(Radio)`
	white-space: nowrap;
	> span {
		width: 100%;
	}
`
