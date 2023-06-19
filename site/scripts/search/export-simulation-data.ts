import { TFunction } from 'i18next'

import getSimulationData from '../../source/pages/simulateurs-et-assistants/metadata-src.js'
import { absoluteSitePaths } from '../../source/sitePaths.js'

export default getSimulationData({
	t: ((_: string, text: string) => text) as TFunction,
	sitePaths: absoluteSitePaths.fr,
	language: 'fr',
})
