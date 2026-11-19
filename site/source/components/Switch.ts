import { styled } from 'styled-components'

import { Body } from '@/design-system'

export const SwitchContainer = styled.div`
	text-align: left;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	column-gap: ${({ theme }) => theme.spacings.sm};
	width: 100%;
	&:not(:last-of-type) {
		margin-bottom: -${({ theme }) => theme.spacings.sm};
	}
`
// `display: contents` garde la mise en page du `SwitchContainer` : la
// `legend` et les choix restent ses enfants directs pour la mise en forme.
export const SwitchFieldset = styled.fieldset`
	display: contents;

	padding: 0;
	margin: 0;
	border: none;
`
export const SwitchLabel = styled(Body).withConfig({
	shouldForwardProp: (prop) => prop !== 'isRule',
})<{ isRule?: boolean }>`
	display: inline-block;
	margin: 0;
	padding: 0;
	margin-bottom: ${({ isRule, theme }) =>
		theme.spacings[isRule ? 'xxs' : 'sm']};
	font-weight: 700;
`
export const RuleSwitchLabel = styled(SwitchLabel).attrs({
	isRule: true,
})``
