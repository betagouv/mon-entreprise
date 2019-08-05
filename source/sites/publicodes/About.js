import React from 'react'
import { Markdown } from 'Components/utils/markdown'
import about from 'raw-loader!./about.md'

export default () => (
	<section className="ui__ container" id="about">
		<Markdown source={about} />
		<p>
			Le code de ce site{' '}
			<a href="https://github.com/laem/futureco"> est libre</a>.
		</p>
	</section>
)
