/* eslint @typescript-eslint/ban-ts-comment: 0 */
// @ts-nocheck
// here be mock dragons
import { action } from '@storybook/addon-actions'
import * as amplitudeBase from '@amplitude/analytics-browser'

export type AmplitudeClient = typeof amplitudeBase

const mockAmplitudeClient: AmplitudeClient = {
  ...amplitudeBase,
  init: action('amplitude.init'),
  flush: action('amplitude.flush'),
  track: action('amplitude.track'),
  setUserId: action('amplitude.setUserId'),
  identify: action('amplitude.identify'),
  Identify: class {
    set(...args) {
      action('amplitude.Identify.set')(args)
    }
    setOnce(...args) {
      action('amplitude.Identify.setOnce')(args)
    }
  }
}

export default mockAmplitudeClient
