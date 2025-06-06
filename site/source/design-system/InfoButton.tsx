import { ReactNode } from 'react'

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
	'aria-label': ariaLabel,
	...props
}: InfoButtonProps) {
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
			aria-label={ariaLabel ?? `Plus d'informations sur ${title}`}
			{...props}
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
