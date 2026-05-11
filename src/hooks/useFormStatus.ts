import { useState } from 'react';
import { extractApiError } from '../utils/extractApiError';

export function useFormStatus() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const run = async (fn: () => Promise<void>, fallback = 'An error occurred.') => {
        setIsSubmitting(true);
        setSuccessMessage(null);
        setErrorMessage(null);
        try {
            await fn();
        } catch (err: unknown) {
            setErrorMessage(extractApiError(err, fallback));
        } finally {
            setIsSubmitting(false);
        }
    };

    return { isSubmitting, successMessage, setSuccessMessage, errorMessage, setErrorMessage, run };
}
