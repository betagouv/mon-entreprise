/* @flow */
import { constructSitePaths } from '../../utils'

const sitePath = constructSitePaths('', {
	index: '',
	documentation: {
		index: '/documentation',
		exemples: '/exemples'
	},
	contact: '/contact'
})

export default () => sitePath
