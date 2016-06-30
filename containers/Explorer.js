import React from 'react'
import data from '../model'
console.log(data)
export default class Explorer extends React.Component {
	render() {
		return (
			<ul id="tags">
				{data.map(tag =>
					<TagSelect key={tag.name} tag={tag} />
				)}
			</ul>
		)
	}
}

class TagSelect extends React.Component {
	render(){
		let {name, choices, number} = this.props.tag
		return (<li>
			<span className="name">{`${name} (${number} variables)`}</span>
			<ul className="choices">
				{[...choices].map(c => <li key={c}>
					{c}
				</li>)}
			</ul>
		</li>)
	}
}
