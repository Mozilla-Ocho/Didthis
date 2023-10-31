module.exports = {
  stories: [
    "../screens/**/*.stories.?(ts|tsx|js|jsx)",
    "../components/**/*.stories.?(ts|tsx|js|jsx)",
  ],
  addons: [
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-actions",
  ],
};
