import type { Meta, StoryObj } from '@storybook/react'
import { MockStoreWrapper } from '../../mocks/store/storybook'
import { apiUser, apiUserBlankSlate } from '../../mocks/apiUser'
import project from '../../mocks/apiProject'
import StaticLayout from '../StaticLayout'

import NewProjectPage from './ProjectNew'

import '@/styles/globals.css'

const meta = {
  title: 'components/pages/ProjectNew',
  component: NewProjectPage,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof NewProjectPage>

export default meta

type Story = StoryObj<typeof meta>

const Subject = () => (
  <StaticLayout>
    <NewProjectPage />
  </StaticLayout>
)

export const Default: Story = {
  render: args => (
    <MockStoreWrapper authUser={apiUserBlankSlate}>
      <Subject />
    </MockStoreWrapper>
  ),
}

export const Trial: Story = {
  render: args => (
    <MockStoreWrapper authUser={{ ...apiUserBlankSlate, isTrial: true }}>
      <Subject />
    </MockStoreWrapper>
  ),
}
