import type { Meta, StoryObj } from '@storybook/react'
import { MockStoreWrapper } from '../../mocks/store/storybook'
import authUser from '../../mocks/apiUser'
import project from '../../mocks/apiProject'

import ProjectForm from './ProjectForm'

import '@/styles/globals.css'

const meta = {
  title: 'components/forms/ProjectForm',
  component: ProjectForm,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof ProjectForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    mode: 'edit',
    project,
  },
  render: args => (
    <MockStoreWrapper authUser={authUser}>
      <ProjectForm {...args} />
    </MockStoreWrapper>
  ),
}

export const TrialAccount: Story = {
  args: {
    mode: 'edit',
    project,
  },
  render: args => (
    <MockStoreWrapper authUser={{ ...authUser, isTrial: true }}>
      <ProjectForm {...args} />
    </MockStoreWrapper>
  ),
}
