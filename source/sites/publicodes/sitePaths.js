import { constructSitePaths } from '../mon-entreprise.fr/sitePaths'

const sitePath = constructSitePaths('', {
	index: '',
	documentation: {
		index: '/documentation',
		exemples: '/exemples'
	},
	contact: '/contact'
})

export default () => sitePath
