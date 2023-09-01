/* eslint @typescript-eslint/ban-ts-comment: 0 */
// @ts-nocheck
// here be mock dragons
import { action } from '@storybook/addon-actions'

import apiClientDefault from '../../mocks/apiClient/storybook'
import amplitude from '../../mocks/amplitude/storybook'

import {
  BaseMockStoreWrapper,
  BaseMockStoreWrapperProps,
  buildMockStore,
} from './index'

export const buildStore: typeof buildMockStore = (
  storeParams,
  storeOverrides
) =>
  buildMockStore(storeParams, {
    initFirebase: action('initFirebase'),
    trackEvent: action('trackEvent'),
    launchGlobalLoginOverlay: action('launchGlobalLoginOverlay'),
    beginClaimTrialAccount: action('beginClaimTrialAccount'),
    logOut: action('logOut'),
    ...storeOverrides,
  })

export type MockStoreWrapperProps = Omit<BaseMockStoreWrapperProps, 'buildStore'>;

export const MockStoreWrapper = ({
  children,
  apiClient = apiClientDefault,
  ...args
}: MockStoreWrapperProps) => {
  return (
    <BaseMockStoreWrapper {...{ ...args, buildStore, apiClient, amplitude }}>
      {children}
    </BaseMockStoreWrapper>
  )
}
