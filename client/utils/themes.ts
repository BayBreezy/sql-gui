import { ThemeDefinition } from "vuetify";

export const light: ThemeDefinition = {
  dark: false,
  colors: {
    primary: twColors.violet[600],
    "primary-lighten-1": twColors.violet[500],
    "primary-lighten-2": twColors.violet[400],
    "primary-lighten-3": twColors.violet[300],
    "primary-lighten-4": twColors.violet[200],
    "primary-lighten-5": twColors.violet[100],
    "primary-lighten-6": twColors.violet[50],
    "primary-darken-1": twColors.violet[700],
    "primary-darken-2": twColors.violet[800],
    "primary-darken-3": twColors.violet[900],
    "primary-darken-4": twColors.violet[950],

    // State colors
    success: twColors.green[600],
    error: twColors.red[500],
    info: twColors.blue[500],
    warning: twColors.yellow[500],
  },
};
export const dark: ThemeDefinition = {
  dark: true,
  colors: {
    background: twColors.gray[950],
    surface: twColors.gray[900],
    primary: twColors.violet[500],
    "primary-lighten-1": twColors.violet[400],
    "primary-lighten-2": twColors.violet[300],
    "primary-lighten-3": twColors.violet[200],
    "primary-lighten-4": twColors.violet[100],
    "primary-lighten-5": twColors.violet[50],
    "primary-darken-1": twColors.violet[600],
    "primary-darken-2": twColors.violet[700],
    "primary-darken-3": twColors.violet[800],
    "primary-darken-4": twColors.violet[900],
    "primary-darken-5": twColors.violet[950],

    // State colors
    success: twColors.green[500],
    error: twColors.red[500],
    info: twColors.blue[500],
    warning: twColors.yellow[500],
  },
};
