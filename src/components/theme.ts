import { defineConfig, createSystem, defaultConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: {
            value: { _light: 'var(--light)', _dark: 'var(--dark)' }, // Custom dark background
          },
          subtle: {
            value: { _light: 'var(--light)', _dark: 'var(--dark)' }, // Custom dark subtle background
          },
          muted: {
            value: { _light: 'var(--light)', _dark: 'var(--dark)' }, // Custom dark muted background
          },
          inverted: {
            value: { _light: 'var(--dark)', _dark: 'var(--light)' },
          },
        },
        fg: {
          DEFAULT: {
            value: { _light: 'var(--dark)', _dark: 'var(--light)' }, // Custom dark text color
          },
          muted: {
            value: { _light: 'var(--dark_lighter)', _dark: 'var(--light)' }, // Custom dark muted text
          },
        },
        border: {
          DEFAULT: {
            value: { _light: 'var(--dark)', _dark: 'var(--light)' }, // Custom dark border
          },
        },
        caret: {
          DEFAULT: {
            value: { _light: 'var(--dark)', _dark: 'var(--light)' }, // Custom dark text color
          }
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);