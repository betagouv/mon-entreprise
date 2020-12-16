// ESM wrapper arrond publicodes CJS Module
// For a deep explanation see:
// https://redfin.engineering/node-modules-at-war-why-commonjs-and-es-modules-cant-get-along-9617135eeca1

import publicodes from '../dist/index.js'
export default publicodes.default
export const reduceAST = publicodes.reduceAST
export const transformAST = publicodes.transformAST
export const formatValue = publicodes.formatValue
export const utils = publicodes.utils
export const translateRules = publicodes.translateRules
export const UNSAFE_isNotApplicable = publicodes.UNSAFE_isNotApplicable
