import React from 'react'
import { createMarkdownDiv } from 'Engine/marked'
import about from 'raw-loader!./about.md'

export default () => (
	<section className="ui__ container" id="about">
		<h1>À propos</h1>
		{createMarkdownDiv(about)}
	</section>
)
