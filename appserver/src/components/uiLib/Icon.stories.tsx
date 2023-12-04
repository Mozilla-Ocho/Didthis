import type { Meta, StoryObj } from '@storybook/react'

import Icon from './Icon'

const meta = {
  title: 'components/uiLib/Icon',
  component: Icon.Link,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof Icon.Link>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    className: 'inline-block w-10 h-10 m-4 text-black-300',
  },
  render: args => (
    <p>
      <Icon.Link {...args} /> Link goes here
    </p>
  ),
}
