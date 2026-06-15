import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Markdown } from './markdown'
import { HelpButtonWithPopover } from './molecules/HelpButtonWithPopover'

export interface InfoButtonProps {
	title: string
	description?: string | ReactNode
	children?: ReactNode
}

export function InfoButton({ title, description, children }: InfoButtonProps) {
	const { t } = useTranslation()

	if (!description && !children) {
		return null
	}

	return (
		<HelpButtonWithPopover
			type="info"
			title={title}
			light
			className="print-hidden"
			aria-haspopup="dialog"
			aria-label={t('Info sur {{ title }}', {
				title,
			})}
		>
			{description && typeof description === 'string' ? (
				<Markdown>{description}</Markdown>
			) : (
				description
			)}
			{children}
		</HelpButtonWithPopover>
	)
}
