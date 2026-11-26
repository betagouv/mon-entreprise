import 'server-only'

import { buildTimeCatalog } from './buildTimeCatalog'
import { setAppLanguage } from './i18n'
import { parseLangue } from './langue'

export const langue = parseLangue(process.env.LANGUE)

export default setAppLanguage(langue, { catalog: buildTimeCatalog })
