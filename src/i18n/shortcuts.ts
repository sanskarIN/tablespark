export const shortcutCopy = {
  open: 'Keyboard shortcuts',
  title: 'Keyboard shortcuts',
  description: 'Use these shortcuts when the browser or operating system does not reserve them.',
  close: 'Close shortcuts',
  helpKey: '?',
  helpDescription: 'Open or close this shortcut reference',
  navigationKey: (number: number) => `Alt+${number}`,
  navigationDescription: (label: string) => `Open ${label}`,
  escapeKey: 'Esc',
  escapeDescription: 'Close this shortcut reference',
} as const;
