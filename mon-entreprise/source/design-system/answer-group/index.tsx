import { Grid } from '@mui/material'
import { FunctionComponent, ReactNode } from 'react'

type AnswerGroupProps = {
	children: ReactNode[]
}

const AnswerGroup: FunctionComponent<AnswerGroupProps> = ({
	children = [],
}) => {
	return (
		<Grid
			container
			className="answer-group"
			justifyContent="flex-end"
			spacing={1}
		>
			{children.map((c, i) => (
				<Grid key={`answerGroup-${i}`} item sm={12} md="auto">
					{c}
				</Grid>
			))}
		</Grid>
	)
}

export default AnswerGroup
