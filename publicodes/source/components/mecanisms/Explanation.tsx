import React from 'react'
import { capitalise0 } from '../../utils'
import { Markdown } from '../Markdown'

type MecanismProp = {
	exemples: { base: string }
	description: string
	name: string
}

export default function MecanismExplanation({
	name,
	description,
	exemples
}: MecanismProp) {
	return (
		<>
			{!!name && (
				<h2 id={name}>
					<pre>{name}</pre>
				</h2>
			)}
			<Markdown source={description} />
			{exemples && (
				<>
					{Object.entries(exemples).map(([name, exemple]) => (
						<React.Fragment key={name}>
							<h3>{name === 'base' ? 'Exemple' : capitalise0(name)}</h3>
							<Markdown source={`\`\`\`yaml\n${exemple}\n\`\`\``} />
						</React.Fragment>
					))}{' '}
				</>
			)}
		</>
	)
}
