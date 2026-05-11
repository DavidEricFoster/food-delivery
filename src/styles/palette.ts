export const colors = {
    primary: '#d16710',
    primaryLight: '#daad88',
    primaryDark: '#9b4a08',
    secondary: '#52e2ff',
    secondaryLight: '#effcff',
    secondaryDark: '#01768e',
    white: '#fff',
    borderDefault: 'rgba(0, 0, 0, 0.23)',
    borderLight: '#e0e0e0',
    disabledBg: 'rgba(0, 0, 0, 0.12)',
    disabledText: 'rgba(0, 0, 0, 0.26)',
    textSecondary: 'rgba(0, 0, 0, 0.6)',
    textDisabled: 'rgba(0, 0, 0, 0.38)',
    textMuted: '#666',
} as const;

export type AlertType = 'error' | 'success' | 'info' | 'warning';

export const alertPalette: Record<AlertType, { bg: string; border: string; color: string }> = {
    error:   { bg: '#ffebee', border: '#ef5350', color: '#c62828' },
    success: { bg: '#e8f5e9', border: '#66bb6a', color: '#2e7d32' },
    info:    { bg: '#e3f2fd', border: '#42a5f5', color: colors.primaryDark },
    warning: { bg: '#fff8e1', border: '#ffb300', color: '#e65100' },
};
