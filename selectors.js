import { createSelector } from 'reselect'
import finalVariables from './model'

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


export const getVariables = createSelector(
	[state => state.selectedTags],
	tags =>
		finalVariables.filter(variable =>
			//This variable must be tagged as described in the selected tags array
			tags == null ? true : tags.reduce((result, [k, v]) => result && variable.tags && variable.tags[k] === v, true)
		)
)

const getTagStats = createSelector(
	[getVariables],
	variables => tagStats(unorderedTagStats(variables))
)

export const getTagsToSelect = createSelector(
	[getTagStats, state => state.selectedTags],
	(availableTags, selectedTags) =>
		availableTags.filter(t => !selectedTags.find(([name]) => t.name === name))
)
