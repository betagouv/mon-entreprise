import React from 'react'
import { createMarkdownDiv } from 'Engine/marked'
import about from 'raw-loader!./about.md'

export default () => (
	<section className="ui__ container" id="about">
		{createMarkdownDiv(about)}
	</section>
)
