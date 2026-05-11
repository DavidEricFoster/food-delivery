import React from 'react';
import { Alert } from './basic/Alert';
import type { AlertType } from '../styles/palette';

interface FormFeedbackProps {
    successMessage?: string | null;
    errorMessage?: string | null;
    onClearSuccess?: () => void;
    onClearError?: () => void;
}

export const FormFeedback: React.FC<FormFeedbackProps> = ({
    successMessage = '',
    errorMessage = '',
    onClearSuccess = () => {},
    onClearError = () => {},
}) => (
    <>
        {successMessage && (
            <Alert type={'success' as AlertType} onClose={onClearSuccess}>
                {successMessage}
            </Alert>
        )}
        {errorMessage && (
            <Alert type={'error' as AlertType} onClose={onClearError}>
                {errorMessage}
            </Alert>
        )}
    </>
);
