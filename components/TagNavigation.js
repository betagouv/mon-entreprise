import React from 'react'


export default class TagNavigation extends React.Component {
	render(){
		let {tagsToSelect, selectedTags, selectTag} = this.props
		return (
			<section id="tag-navigation">
				{selectedTags.length > 0 &&
					<ul id="selected">
						{selectedTags.map(([name, value]) => <li>
							{name + ': ' + value}
						</li>)
						}
					</ul>
				}
				<ul id="to-select">
					{tagsToSelect.map(tag =>
						<Tag selectTag={selectTag} key={tag.name} tag={tag} />
					)}
				</ul>

			</section>
		)
	}
}

class Tag extends React.Component {
	render(){
		let {tag: {name, choices, number}, selectTag} = this.props
		return (<li>
			<span className="name">{`${name} (${number} variables)`}</span>
			<ul className="choices">
				{[...choices].map(c =>
					<li key={c} onClick={() => selectTag(name, c)}>
					{c}
					</li>
				)}
			</ul>
		</li>)
	}
}

export default TagNavigation
