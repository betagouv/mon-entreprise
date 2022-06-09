import { Children, FunctionComponent, ReactNode } from 'react'

type AnswerGroupProps = {
	children: ReactNode
}

const AnswerGroup: FunctionComponent<AnswerGroupProps> = ({ children }) => {
	return (
		<div
			css={`
				display: flex;
				gap: 18px;
			`}
		>
			{Children.map(children, (c, i) => (
				<div key={`answerGroup-${i}`}>{c}</div>
			))}
		</div>
	)
}

export default AnswerGroup
