import React from 'react'
import TagMap from './TagMap'

export default class TagNavigation extends React.Component {
	render(){
		let {tagsToSelect, selectedTags, selectTag, resetTags} = this.props
		return (
			<section id="tag-navigation">
				<h2>☛ Explorez par catégorie</h2>
				<div className="content">
					{selectedTags.length > 0 &&
						<div id="selected">
							<TagMap data={selectedTags} />
							<button onClick={resetTags}>Effacer ma sélection ✕</button>
						</div>
					}
					<ul id="to-select">
						{tagsToSelect.map(tag =>
							<Tag selectTag={selectTag} key={tag.name} tag={tag} />
						)}
					</ul>
				</div>
			</section>
		)
	}
}

class Tag extends React.Component {
	render(){
		let {tag: {name, choices, number}, selectTag} = this.props
		return (<li>
			<span className="name">
				{name}
				<span className="nb">
					({number} variable{number > 1 ? 's' : ''})
				</span>
			</span>
			<ul className="choices">
				{[...choices].map(c =>
					<li className="tag-value" key={c} onClick={() => selectTag(name, c)}>
					{c}
					</li>
				)}
			</ul>
		</li>)
	}
}

export default TagNavigation
