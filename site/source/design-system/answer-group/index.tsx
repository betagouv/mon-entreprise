import { Grid } from '@mui/material'
import { Children, ComponentProps, FunctionComponent, ReactNode } from 'react'

type AnswerGroupProps = {
	children: ReactNode
} & ComponentProps<typeof Grid>

const AnswerGroup: FunctionComponent<AnswerGroupProps> = ({
	children,
	...props
}) => {
	return (
		<Grid container spacing={3} {...props}>
			{Children.map(children, (c, i) => (
				<Grid key={`answerGroup-${i}`} item sm={12} md="auto">
					{c}
				</Grid>
			))}
		</Grid>
	)
}

export default AnswerGroup
