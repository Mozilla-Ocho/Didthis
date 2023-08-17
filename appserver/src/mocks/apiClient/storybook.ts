/* eslint @typescript-eslint/ban-ts-comment: 0 */
// @ts-nocheck
// here be mock dragons
import { result } from 'lodash-es'
import apiClientBase, { ApiClient } from '../../lib/apiClient'
import { SessionLoginAsTrialUserWrapper } from '../../lib/apiConstants'
import { action } from '@storybook/addon-actions'

const asyncAction = (name: string) => async args => action(name)(args)

const mockApiClient: ApiClient = {
  ...apiClientBase,
  saveProfile: asyncAction('saveProfile'),
  saveWaitlist: asyncAction('saveWaitlist'),
  sessionLoginAsTrialUser: async ({ signupCode }) => {
    action('sessionLoginAsTrialUser')({ signupCode })
    const result: SessionLoginAsTrialUserWrapper = {
      action: "sessionLoginAsTrialUser",
      payload: {
        systemSlug: "8675309"
      }
    }
    return result
  },
}

export default mockApiClient
