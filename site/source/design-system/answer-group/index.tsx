import { Children, FunctionComponent, ReactNode } from 'react'

type AnswerGroupProps = {
	children: ReactNode
	role?: string
}

const AnswerGroup: FunctionComponent<AnswerGroupProps> = ({
	children,
	...props
}) => {
	return (
		<div
			style={{
				display: 'flex',
				gap: '18px',
			}}
			{...props}
		>
			{Children.map(children, (c, i) => (
				<div key={`answerGroup-${i}`} role="listitem">
					{c}
				</div>
			))}
		</div>
	)
}

export default AnswerGroup
