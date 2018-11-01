import React from 'react'
import { Trans } from 'react-i18next'

let T = ({ children, k }) => <Trans i18nKey={k}>{children}</Trans>

export { React, T }
