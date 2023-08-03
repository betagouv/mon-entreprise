import { Item } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { Select } from '@/design-system/field/Select'
import useSimulatorsData from '@/hooks/useSimulatorsData'

import { SimulateurCard } from '../../components/SimulateurCard'
import { getFilter } from './StatsDetail'
import { Filter } from './useStatistiques'

export function SelectedSimulator(props: { filter: Filter | '' }) {
	const simulateur = Object.values(useSimulatorsData()).find(
		(s) => JSON.stringify(getFilter(s)) === JSON.stringify(props.filter)
	)
	if (!simulateur) {
		return null
	}

	return <SimulateurCard small {...simulateur} />
}
export function SimulateursChoice(props: {
	onChange: (ch: Filter | '') => void
	value: Filter | ''
}) {
	const simulateurs = useSimulatorsData()
	const choices = Object.values(simulateurs)
		.filter((s) => getFilter(s))
		.sort((a, b) => (a.shortName < b.shortName ? -1 : 1))

	return (
		<Select
			onSelectionChange={(val) => {
				if (val === '' || val === 'api-rest') {
					return props.onChange(val)
				}
				if (!(val in simulateurs)) {
					return
				}
				props.onChange(getFilter(simulateurs[val as keyof typeof simulateurs]))
			}}
			defaultSelectedKey={
				typeof props.value === 'string'
					? props.value
					: JSON.stringify(props.value)
			}
			label={'Voir les statistiques pour :'}
			id="simulator-choice-input"
		>
			{[
				<Item key="" textValue="Tout le site">
					<Emoji emoji="🌍" />
					&nbsp;Tout le site
				</Item>,
				<Item key="api-rest" textValue="API REST">
					<Emoji emoji="👩‍💻" />
					&nbsp;API REST
				</Item>,
				...choices.map((s) => (
					<Item key={s.id} textValue={s.shortName}>
						{s.icône && (
							<>
								<Emoji emoji={s.icône} />
								&nbsp;
							</>
						)}
						{s.shortName}
					</Item>
				)),
			]}
		</Select>
	)
}
