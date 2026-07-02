type Props = {
	date?: Date
}

export const ValeurDate = ({ date }: Props) => (
	<>{date ? date.toLocaleDateString('fr-FR') : null}</>
)
