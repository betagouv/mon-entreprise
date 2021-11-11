import { Grid } from '@mui/material'
import { Children, FunctionComponent, ReactNode } from 'react'

type AnswerGroupProps = {
	children: ReactNode
}

const AnswerGroup: FunctionComponent<AnswerGroupProps> = ({ children }) => {
	return (
		<Grid
			container
			className="answer-group"
			justifyContent="flex-end"
			spacing={1}
		>
			{Children.map(children, (c, i) => (
				<Grid key={`answerGroup-${i}`} item sm={12} md="auto">
					{c}
				</Grid>
			))}
		</Grid>
	)
}

export default AnswerGroup
