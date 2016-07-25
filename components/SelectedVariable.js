import React, { Component } from 'react'

export default class SelectedVariable extends Component {
	render() {
		let {
			variable: {
				name,
				first: {
					description
				},
				tags
			},
			selectedTags
		} = this.props
		return (
			<section id="selected-variable">
				<h1>{name}</h1>
				<p>{description}</p>
				<ul>
					{Object.keys(tags)
							.filter(name => !selectedTags.find(([n]) => name == n))
							.map(name =>
								<li key={name}>
									{name + ': ' + tags[name]}
								</li>
							)}
				</ul>
			</section>)
	}
}
