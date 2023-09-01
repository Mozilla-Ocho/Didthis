/* eslint @typescript-eslint/ban-ts-comment: 0 */
// @ts-nocheck
// here be mock dragons
import { action } from '@storybook/addon-actions'

import apiClientDefault from '../../mocks/apiClient/storybook'
import amplitude from '../../mocks/amplitude/storybook'

import {
  BaseMockStoreWrapper,
  BaseMockStoreWrapperProps,
  buildMockStore as baseBuildMockStore,
} from './index'

export const buildMockStore: typeof baseBuildMockStore = (
  storeParams,
  storeOverrides
) =>
  baseBuildMockStore(storeParams, {
    initFirebase: action('initFirebase'),
    trackEvent: action('trackEvent'),
    launchGlobalLoginOverlay: action('launchGlobalLoginOverlay'),
    beginClaimTrialAccount: action('beginClaimTrialAccount'),
    logOut: action('logOut'),
    ...storeOverrides,
  })

export type MockStoreWrapperProps = Omit<BaseMockStoreWrapperProps>;

export const MockStoreWrapper = ({
  children,
  apiClient = apiClientDefault,
  buildStore = buildMockStore,
  ...args
}: MockStoreWrapperProps) => {
  return (
    <BaseMockStoreWrapper {...{ ...args, buildStore, apiClient, amplitude }}>
      {children}
    </BaseMockStoreWrapper>
  )
}
