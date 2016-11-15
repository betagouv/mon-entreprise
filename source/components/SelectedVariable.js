import React, { Component } from 'react'
import './SelectedVariable.css'
import TagMap from './TagMap'
import R from 'ramda'

export default class SelectedVariable extends Component {
	render() {
		let {
			variable: {
				name,
				first: {
					description
				},
				tags,
				calculable
			},
			selectedTags
		} = this.props,

			tagsList = R.pluck('tags', calculable),
			commonTags = R.tail(tagsList).reduce(
				(result, next) => R.intersection(result, R.toPairs(next)),
				R.toPairs(R.head(tagsList))
			),
			itemsWithUniqueTags = R.map(item => [item, R.fromPairs(R.difference(R.toPairs(item.tags), commonTags))], calculable)


		return (
			<section id="selected-variable">
				<h1>{name}</h1>
				<p>{description}</p>
				<TagMap data={commonTags} />
				{/*
				<ul>
					{Object.keys(tags)
							.filter(name => !selectedTags.find(([n]) => name == n))
							.map(name =>
								<li key={name}>
									{name + ': ' + tags[name]}
								</li>
							)}
				</ul>
				*/}
				<Items itemsWithUniqueTags={itemsWithUniqueTags}/>
			</section>)
	}
}

class Items extends Component {
	render() {
		let {itemsWithUniqueTags} = this.props

		return (
			<ul id="calculable-items">
				{itemsWithUniqueTags.map(([item, tags], i) =>
					<Item key={i} item={item} tags={tags}/>
				)}
			</ul>
		)
	}
}

let Item = ({item: {linear, marginalRateTaxScale}, tags}) =>
<li className="item">
	<div className="left">
		<TagMap data={tags} />
	</div>
	<div className="right">
		{	linear && <Linear data={linear}/>
			||	marginalRateTaxScale && <TaxScale data={marginalRateTaxScale}/>
		}
	</div>
</li>


let Linear = ({data: {
	base,
	limit,
	historique
}}) => <div className="calc">
	<h3>Calcul linéaire</h3>
	<div className="linear">
		<div className="base">
			<div className="label">base</div>
			<div className="value">{base}</div>
		</div>
		<span className="operator">
			✕
		</span>
		<div className="rate">
			<div className="label">Taux</div>
			<div className="value">{
					historique[(Object.keys(historique).sort()[0])]
			}</div>
		</div>
		{ limit != null &&  <div className="limit">
				<span className="label">dans la limite de : </span>
				<span className="value"> {limit}</span>
			</div>	}
	</div>
</div>

let TaxScale = ({data}) => <div className="calc tax-scale">
	<h3>Règle de calcul: barème</h3>
	{JSON.stringify(data)}
</div>
