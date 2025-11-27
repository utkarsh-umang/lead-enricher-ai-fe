export const lightTheme = {
  palette: {
    mode: 'light',
    primary: {
      main: '#F5C518',   // The Digital Gold
      dark: '#E3B512',   // Hover state
      light: '#FFF5CC',  // Subtle tint backgrounds
      contrastText: '#121212', // IMPORTANT: Text color *on top* of yellow buttons
    },
    background: {
      default: '#FFFFFF', // Main app background
      paper: '#F8F9FA',   // Card/modal backgrounds
    },
    text: {
      primary: '#121212',   // Main dark text
      secondary: '#595959', // Subtitles
      disabled: '#A6A6A6',  // Inactive text
    },
    divider: '#E0E0E0',     // Borders
    
    // Semantic standard colors
    success: {
      main: '#2E7D32',
    },
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#ED6C02', // Distinct orange
    },
    info: {
      main: '#0288D1',
    },
  },
  
  // You can also add global styles here if using styled-components
  // to apply that cool background image to the top section globally.
  global: {
    headerBackground: `url('/path/to/your/image_7.png')`, // The image we generated
  }
};

export type Theme = typeof lightTheme;

