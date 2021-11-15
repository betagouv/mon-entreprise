import { Grid } from '@mui/material'
import { Children, FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components'

type AnswerGroupProps = {
	children: ReactNode
}

const AnswerGroup: FunctionComponent<AnswerGroupProps> = ({ children }) => {
	return (
		<StyledGroup>
			<Grid container justifyContent="flex-start" spacing={1}>
				{Children.map(children, (c, i) => (
					<Grid key={`answerGroup-${i}`} item sm={12} md="auto">
						{c}
					</Grid>
				))}
			</Grid>
		</StyledGroup>
	)
}

const StyledGroup = styled.div`
	margin: ${({ theme }) => theme.spacings.md} 0;
`

export default AnswerGroup
