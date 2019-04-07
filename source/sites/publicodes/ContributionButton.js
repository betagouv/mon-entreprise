import { React, emoji } from 'Components'
import { Link } from 'react-router-dom'
export default ({ input }) => (
	<div
		css={`
			display: flex;
			align-items: center;
			justify-content: center;
		`}>
		Contribuer
		<Link to={'/contribuer/' + input}>
			<button
				css={`
					border-radius: 10em;
					box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
						0px 6px 10px 0px rgba(0, 0, 0, 0.14),
						0px 1px 18px 0px rgba(0, 0, 0, 0.12);
					height: 2.5em;
					width: 2.5em;
					padding: 0em;
					background: var(--colour);
					color: white;
					font-weight: 400;
					font-size: 180%;
					margin: 0.3em;
				`}>
				{emoji('✍️')}
			</button>
		</Link>
	</div>
)
