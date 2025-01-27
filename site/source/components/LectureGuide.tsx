import { styled } from 'styled-components'

import { Grid } from '@/design-system/layout'

export default function LectureGuide() {
	return (
		<LectureGuideContainer item md>
			<Dots />
		</LectureGuideContainer>
	)
}

const LectureGuideContainer = styled(Grid)`
	display: none;

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		display: block;
	}
`

const Dots = styled.div.attrs({ 'aria-hidden': true })`
	border-bottom: 1px dashed
		${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.extended.grey[700]};
	align-self: baseline;
	opacity: 50%;
	flex: 1;
`
