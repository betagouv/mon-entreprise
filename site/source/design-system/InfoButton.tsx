import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Markdown } from './markdown'
import { HelpButtonWithPopover } from './molecules/HelpButtonWithPopover'

export interface InfoButtonProps {
	title: string
	description?: string | ReactNode
	light?: boolean
	bigPopover?: boolean
	children?: ReactNode
	className?: string
	onClick?: () => void
	'aria-label'?: string
}

export function InfoButton({
	title,
	description,
	light,
	bigPopover,
	children,
	className,
	onClick,
	'aria-label': ariaLabel,
}: InfoButtonProps) {
	const { t } = useTranslation()

	if (!description && !children) {
		return null
	}

	return (
		<HelpButtonWithPopover
			type="info"
			title={title}
			light={light}
			bigPopover={bigPopover}
			className={className || 'print-hidden'}
			aria-haspopup="dialog"
			aria-label={
				ariaLabel ??
				t("Plus d'infos sur {{ title }}", {
					title,
				})
			}
			onClick={onClick}
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
