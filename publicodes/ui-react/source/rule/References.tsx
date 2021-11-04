import { capitalise0 } from 'publicodes'

type ReferencesProps = {
	references: Record<string, string>
}

export default function References({ references }: ReferencesProps) {
	return (
		<ul>
			{Object.entries(references).map(([name, link]) => (
				<li
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
					key={name}
				>
					<a
						href={link}
						target="_blank"
						style={{
							marginRight: '1rem',
						}}
					>
						{capitalise0(name)}
					</a>
					<span className="ui__ label">{link}</span>
				</li>
			))}
		</ul>
	)
}
