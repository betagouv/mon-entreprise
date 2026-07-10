import { useTranslation } from 'react-i18next'

import { LOCALE_PAR_LANGUE, parseLangue } from '@/locales/langue'

type Props = {
	date?: Date
}

export const ValeurDate = ({ date }: Props) => {
	const { i18n } = useTranslation()

	return (
		<>
			{date
				? date.toLocaleDateString(LOCALE_PAR_LANGUE[parseLangue(i18n.language)])
				: null}
		</>
	)
}
