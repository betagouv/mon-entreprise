import React from 'react'
import { useParams } from 'react-router'
import emoji from 'react-easy-emoji'

export default ({}) => {
	const { score } = useParams()

	return (
		<div
			className="ui__ full-width"
			css={`
				background: red;
				width: 100vw;
				height: 100vh;
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;

				text-align: center;
				h1 {
					margin: 0.3rem;
				}
			`}
		>
			<h1>Mon empreinte sur le climat</h1>

			<div
				css={`
					> p:first-child {
						font-size: 250%;
					}
				`}
			>
				<p>{Math.round(score / 100) / 10} tonnes</p>
				<p>Moyenne {emoji('🇫🇷')} : 11 tonnes</p>
				<p>Objectif {emoji('😇')} : 2 tonnes</p>
			</div>
		</div>
	)
}
