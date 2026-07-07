import { CircledInfoIcon, ErrorIcon, SuccessIcon } from './icons/index'
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
