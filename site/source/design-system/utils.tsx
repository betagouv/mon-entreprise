import { CircledInfoIcon, ErrorIcon, SuccessIcon } from './icons'
import { ComponentType } from './types'

export const getIconFromType = (type: ComponentType) => {
	switch (type) {
		case 'success':
			return <SuccessIcon />
		case 'error':
			return <ErrorIcon />
		case 'info':
			return <CircledInfoIcon />
	}
}

export const estTexteBrut = (children: React.ReactNode) =>
	typeof children === 'string' ||
	(Array.isArray(children) &&
		children.length === 1 &&
		typeof children[0] === 'string')
