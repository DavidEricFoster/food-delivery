import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Meal, MealSection } from '../../../services/meals';
import { queryKeys } from '../../../services/queryKeys';
import { addMeal, updateMeal } from '../../../services/meals';
import { useFormStatus } from '../../../hooks/useFormStatus';
import { capitalize } from '../../../utils/capitalize';
import {
    Column, FieldGroup, FieldLabel, FormFeedback, Input,
    InputRow, NativeSelect, OutlinedButton, PrimaryButton, Row, Title,
} from '../../basic';

const SectionOptions: MealSection[] = ['breakfast', 'lunch', 'dinner', 'appetizers', 'dessert'];

export interface MealFormProps {
    rid: string;
    meal?: Meal;
    onCancel?: () => void;
    onComplete?: () => void;
}

export const MealForm: React.FC<MealFormProps> = ({ rid, meal, onCancel, onComplete }) => {
    const isEditMode = !!meal;
    const idSuffix = meal?.uuid ?? 'new';

    const [title, setTitle] = useState(meal?.title ?? '');
    const [price, setPrice] = useState(meal ? (meal.price / 100).toFixed(2) : '');
    const [description, setDescription] = useState(meal?.description ?? '');
    const [section, setSection] = useState<MealSection | ''>(meal?.section ?? '');
    const {
        isSubmitting,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
    } = useFormStatus();
    const queryClient = useQueryClient();
    const changeMealMutation = useMutation({
        mutationFn: updateMeal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.restaurantMeals(rid)})
            onComplete?.();
        },
        onError: () => {
            setErrorMessage('Failed to update meal. Please try again.');
        },
    });
    const addMealMutation = useMutation({
        mutationFn: addMeal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.restaurantMeals(rid) })
            onComplete?.();
            setSuccessMessage(`Meal "${title}" added successfully.`);
            setTitle('');
            setPrice('');
            setDescription('');
            setSection('');
        },
        onError: () => {
            setErrorMessage('Failed to add meal. Please try again.');
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const values = {
            title,
            price: Math.round(parseFloat(price) * 100),
            description,
            section: section as MealSection
        };

        if (isEditMode) {
            changeMealMutation.mutate({
                ...values,
                uuid: meal!.uuid,
            });
        } else {
            addMealMutation.mutate({
                ...values,
                restaurantUuid: rid,
            });
        }
    };

    const canSubmit = !isSubmitting && !!title && !!price && !!description && !!section;

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <Title>{isEditMode ? 'Edit meal' : 'Add New Meal'}</Title>
            <FormFeedback
                successMessage={successMessage}
                errorMessage={errorMessage}
                onClearSuccess={() => setSuccessMessage(null)}
                onClearError={() => setErrorMessage(null)}
            />
            <Column>
                <Row>
                    <FieldGroup>
                        <FieldLabel htmlFor={`meal-title-${idSuffix}`}>Title</FieldLabel>
                        <Input
                            id={`meal-title-${idSuffix}`}
                            placeholder="Meal Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </FieldGroup>
                    <FieldGroup>
                        <FieldLabel htmlFor={`meal-price-${idSuffix}`}>Price</FieldLabel>
                        <InputRow>
                            $
                            <Input
                                id={`meal-price-${idSuffix}`}
                                type="number"
                                inputMode="decimal"
                                autoComplete="off"
                                placeholder="0.00"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </InputRow>
                    </FieldGroup>
                </Row>
                <FieldGroup>
                    <FieldLabel htmlFor={`meal-description-${idSuffix}`}>Description</FieldLabel>
                    <Input
                        id={`meal-description-${idSuffix}`}
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </FieldGroup>
                <FieldGroup>
                    <FieldLabel htmlFor={`meal-section-${idSuffix}`}>Section</FieldLabel>
                    <NativeSelect
                        id={`meal-section-${idSuffix}`}
                        value={section}
                        onChange={(e) => setSection(e.target.value as MealSection)}
                        required
                    >
                        {!isEditMode && <option value="" disabled>Section</option>}
                        {SectionOptions.map((option) => (
                            <option key={option} value={option}>
                                {capitalize(option)}
                            </option>
                        ))}
                    </NativeSelect>
                </FieldGroup>
            </Column>
            <Row>
                <PrimaryButton type="submit" disabled={!canSubmit}>
                    {isSubmitting ? 'Saving...' : isEditMode ? 'Save changes' : 'Add Meal'}
                </PrimaryButton>
                {onCancel && (
                    <OutlinedButton type="button" onClick={onCancel} disabled={isSubmitting}>
                        Cancel
                    </OutlinedButton>
                )}
            </Row>
        </form>
    );
};
