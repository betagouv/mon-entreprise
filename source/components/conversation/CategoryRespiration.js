import React from 'react'
import emoji from 'react-easy-emoji'
import { motion } from 'framer-motion'

export default ({ dismiss, questionCategory }) => {
	return (
		<motion.section
			initial={{ backgroundColor: '#ffffff', scale: 0 }}
			animate={{
				backgroundColor: questionCategory.couleur,
				scale: 1,
			}}
			transition={{
				type: 'spring',
				stiffness: 150,
				damping: 30,
			}}
			className="ui__ full-width "
			css={`
				text-align: center;
				padding: 1rem;
				h2 {
					color: white;
					margin: 0.4rem;
					text-transform: uppercase;
					font-weight: 300;
				}
				img {
					font-size: 350%;
					margin: 0.4rem;
				}
				button {
					display: block !important;
					margin: 1rem auto;
				}
			`}
		>
			<h2>{questionCategory.title}</h2>
			{emoji(questionCategory.icônes)}
			<button className="ui__ plain button" onClick={dismiss}>
				C'est parti !
			</button>
		</motion.section>
	)
}
