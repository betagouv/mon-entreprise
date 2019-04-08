import React, { Component } from 'react'
import { Trans } from 'react-i18next'
import emoji from 'react-easy-emoji'

let T = ({ children, k }) => <Trans i18nKey={k}>{children}</Trans>

export { React, Component, T, emoji }
