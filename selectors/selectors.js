import { createSelector } from 'reselect'
import {calculableItems, higherOrderVariables, mergedItems} from '../model'
import R from 'ramda'

let
	// variableHasTagValue = variable => ([tag, value]) => console.log('tv', variable.tags, tag, value),
	variableHasTagValue = variable => ([osef, [tag, value]]) => R.pathEq(['tags', tag], value)(variable),
	variableHasSelectedTags = variable => R.compose(
		R.all(variableHasTagValue(variable)),
		R.toPairs
	),
	filterVariables = variables => tags => R.filter(item => variableHasSelectedTags(item)(tags))(variables)

export const finalVariablesSelector = createSelector(
	[state => state.selectedTags],
	filterVariables(calculableItems)
)

/* Tag names, values, and number of variables per tag */
const unorderedTagStats = finalVariables =>
	finalVariables
		.reduce((stats, variable) => {
			Object.keys(variable.tags).map(
				k => {
					stats[k] = stats[k] || {number: 0, choices: new Set()}
					stats[k].number = stats[k].number + 1
					stats[k].choices.add(variable.tags[k])
				}
			)
			return stats
		}, {}),

	tagStats = stats =>
		Object.keys(stats)
			.reduce((acc, n) => ([...acc, {name: n, ...stats[n]}]), [])
			.sort((a, b) => b.number - a.number)

let tagStatsSelector = createSelector(
	[finalVariablesSelector],
	variables => tagStats(unorderedTagStats(variables))
)

export let tagsToSelectSelector = createSelector(
	[state => state.selectedTags, tagStatsSelector],
	(selectedTags, availableTags) =>
		availableTags.filter(t => !selectedTags.find(([name]) => t.name === name))
)

export let variablesSelector = createSelector(
	[state => state.selectedTags],
	selectedTags =>	R.filter(
		({tags}) =>
			R.all(
				([tag, value]) => tags[tag] && R.contains(value, tags[tag]),
			)(selectedTags)
	)(mergedItems)
)
