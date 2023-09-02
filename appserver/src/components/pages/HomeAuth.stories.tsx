import type { Meta, StoryObj } from '@storybook/react'

import { MockStoreWrapper } from '../../mocks/store/storybook'
import apiClientDefault from '../../mocks/apiClient/storybook'
import {
  apiUser,
  apiUserBlankSlate,
  apiUserWithProject,
} from '../../mocks/apiUser'
import apiProject from '../../mocks/apiProject'
import { ApiClient } from '../../lib/apiClient'
import { KEY_TRIAL_ACCOUNT_CLAIMED } from '@/lib/store/store'
import StaticLayout from '../StaticLayout'
import HomeAuth from './Home'

import { action } from '@storybook/addon-actions'

import '@/styles/globals.css'

const meta = {
  title: 'components/pages/HomeAuth',
  component: HomeAuth,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
  decorators: [
    Story => {
      window.localStorage.setItem(
        'skipBlankSlate', // DRY_26502
        'true'
      )
      window.localStorage.removeItem(KEY_TRIAL_ACCOUNT_CLAIMED)
      return <Story />
    },
  ],
} satisfies Meta<typeof HomeAuth>

export default meta

type Story = StoryObj<typeof meta>

const Subject = () => (
  <StaticLayout>
    <HomeAuth />
  </StaticLayout>
)

export const BlankSlate: Story = {
  args: {},
  render: args => {
    window.localStorage.removeItem(KEY_TRIAL_ACCOUNT_CLAIMED)
    window.localStorage.removeItem(
      'skipBlankSlate' // DRY_26502
    )
    return (
      <MockStoreWrapper
        authUser={{ ...apiUserBlankSlate, isTrial: true }}
        apiClient={apiClient}
      >
        <Subject />
      </MockStoreWrapper>
    )
  },
}

export const TrialAccountNoProjects: Story = {
  name: 'Trial (no projects)',
  render: args => (
    <MockStoreWrapper
      authUser={{ ...apiUserBlankSlate, isTrial: true }}
      apiClient={apiClient}
    >
      <Subject />
    </MockStoreWrapper>
  ),
}

export const TrialAccountWithProjects: Story = {
  name: 'Trial (with projects)',
  render: args => (
    <MockStoreWrapper
      authUser={{
        ...apiUserBlankSlate,
        profile: {
          ...apiUserBlankSlate.profile,
          projects: {
            [apiProject.id]: apiProject,
          },
        },
        isTrial: true,
      }}
      apiClient={apiClient}
    >
      <Subject />
    </MockStoreWrapper>
  ),
}

export const TrialSignedUp: Story = {
  args: {},
  render: args => {
    window.localStorage.setItem(KEY_TRIAL_ACCOUNT_CLAIMED, 'true')
    window.localStorage.removeItem(
      'skipBlankSlate' // DRY_26502
    )
    return (
      <MockStoreWrapper authUser={apiUserWithProject} apiClient={apiClient}>
        <Subject />
      </MockStoreWrapper>
    )
  },
}

export const NoProjects: Story = {
  args: {},
  render: args => (
    <MockStoreWrapper authUser={apiUser} apiClient={apiClient}>
      <Subject />
    </MockStoreWrapper>
  ),
}

export const WithProjects: Story = {
  render: args => (
    <MockStoreWrapper authUser={apiUserWithProjects} apiClient={apiClient}>
      <Subject />
    </MockStoreWrapper>
  ),
}

const apiUserWithProjects = {
  ...apiUser,
  profile: {
    ...apiUser.profile,
    projects: {
      [apiProject.id]: apiProject,
    },
  },
}

const apiClient: ApiClient = {
  ...apiClientDefault,
}
