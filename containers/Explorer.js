import React from 'react'
import parameters from '../load-parameters'
import deepAssign from 'deep-assign'

let
	groupedByVariableName = parameters
		.filter(p => p && p.variable)
		.reduce((acc, p) => {
			let variableName = p.variable
			if (acc[variableName])
				acc[variableName].push(p)
			else
				acc[variableName] = [p]
			return acc
		}, {}),

	conflictingTags = (tags1, tags2) =>
		Object.keys(tags1).reduce((conflicts, k) => {
			if (typeof tags2[k] != 'undefined' && tags2[k] !== tags1[k])
				conflicts.push(k)
			return conflicts
		}, []),

	groupedMergedVariables =
		Object.keys(groupedByVariableName)
			.reduce((list, name) => {
				let items = groupedByVariableName[name]
				/* 	Les items sont des fragments de variables.
						Les premiers fragments vont être fusionnés dans les suivants,
						sauf s'il introduit un écrasement d'un tag */
				let variableList = items.slice(1).reduce((mergedItems, item) => {
					let mergedItem = mergedItems.reduce((final, itemBefore) => {
						let oups = conflictingTags(itemBefore.tags, item.tags)
						//console.log('conflicts for ', itemBefore.tags, item.tags)
						return oups.length ? item : deepAssign({}, item, itemBefore)
					},
					item)
					mergedItems.push(mergedItem)
					return mergedItems
				},
				[items[0]])
				return [...variableList, ...list]
			}, []),

	tagFrequency =
		groupedMergedVariables
			.reduce((stats, variable) => {
				Object.keys(variable.tags).map(
					k => {
						stats[k] = stats[k] || {number: 0, choices: new Set()}
						stats[k].number = stats[k].number + 1
						stats[k].choices.add(variable.tags[k])
					}
				)
				return stats
			}
		, {})


console.log('YOUYOU', tagFrequency)

export default class Explorer extends React.Component {
	render() {
		return (
			<ul id="tags">
				{Object.keys(tagFrequency).map(tag =>
					<li key={tag}>{tag}</li>
				)}
			</ul>
		)
	}
}
