/* eslint @typescript-eslint/ban-ts-comment: 0 */
// @ts-nocheck
// here be mock dragons
import apiClientBase, { ApiClient } from '../../lib/apiClient'
import { action } from '@storybook/addon-actions'

const asyncAction = (name: string) => async args => action(name)(args)

const mockApiClient: ApiClient = {
  ...apiClientBase,
  saveProfile: asyncAction('saveProfile'),
  saveWaitlist: asyncAction('saveWaitlist'),
  sessionLoginAsTrialUser: asyncAction('sessionLoginAsTrialUser'),
}

export default mockApiClient
