import React from 'react'
import { createMarkdownDiv } from 'Engine/marked'
import about from 'raw-loader!./about.md'

export default () => (
	<section className="ui__ container" id="about">
		{createMarkdownDiv(about)}
		<p>
			Le code de ce site{' '}
			<a href="https://github.com/laem/futureco"> est libre</a>.
		</p>
	</section>
)
