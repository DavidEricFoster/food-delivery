import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { queryKeys } from '../../../services/queryKeys';
import { createRestaurant, fetchRestaurant, updateRestaurant } from '../../../services/restaurants';
import type { CuisineType } from '../../../services/restaurants';
import type { CreateRestaurant } from '../../../services/restaurants';
import { useFormStatus } from '../../../hooks/useFormStatus';
import { capitalize } from '../../../utils/capitalize';
import {
    Column, FieldGroup, FieldLabel, FormFeedback, Input, NativeSelect,
    OutlinedButton, PrimaryButton, Row, Subtitle, Textarea,
} from '../../basic';
import { spacing } from '../../../styles/spacing';

const CUISINE_OPTIONS: CuisineType[] = [
    'italian',
    'french',
    'chinese',
    'japanese',
    'indian',
    'mexican',
    'greek',
];

const EMPTY_FORM: CreateRestaurant = {
    title: '',
    description: '',
    cuisine: 'italian',
};

interface CoordFields {
    lat: string;
    lng: string;
}

interface RestaurantFormProps {
    restaurantId?: string;
    setEditingRestaurantIds?: React.Dispatch<React.SetStateAction<string[]>>;
    setIsAddingRestaurant?: React.Dispatch<React.SetStateAction<boolean>>;
}

const EMPTY_COORDS: CoordFields = { lat: '', lng: '' };

const FormStack = styled(Column)`
    gap: ${spacing.m};
    max-width: 480px;
`;

export const RestaurantForm: React.FC<RestaurantFormProps> = ({
    restaurantId,
    setEditingRestaurantIds,
    setIsAddingRestaurant,
}) => {
    const queryClient = useQueryClient();
    const isEditMode = !!restaurantId;

    const { data: existingRestaurant } = useQuery({
        queryKey: queryKeys.restaurant(restaurantId ?? ''),
        queryFn: () => fetchRestaurant(restaurantId!),
        enabled: isEditMode,
        staleTime: 30_000,
    });

    const [form, setForm] = useState<CreateRestaurant>(EMPTY_FORM);
    const [coords, setCoords] = useState<CoordFields>(EMPTY_COORDS);

    useEffect(() => {
        if (!existingRestaurant) return;
        setForm({
            title: existingRestaurant.title,
            description: existingRestaurant.description,
            cuisine: existingRestaurant.cuisine,
        });
        setCoords({
            lat: existingRestaurant.location?.lat ?? '',
            lng: existingRestaurant.location?.lng ?? '',
        });
    }, [existingRestaurant]);

    const {
        isSubmitting,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
        run
    } = useFormStatus();

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCoordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCoords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCuisineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, cuisine: e.target.value as CuisineType }));
    };

    const addRestaurantMutation = useMutation({
        mutationFn: createRestaurant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.restaurants() });
            setForm(EMPTY_FORM);
            setCoords(EMPTY_COORDS);
            setIsAddingRestaurant?.(false);
        },
        onError: () => {
            setErrorMessage('Failed to create restaurant. Please try again.');
        }
    });

    const editRestaurantMutation = useMutation({
        mutationFn: updateRestaurant,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.restaurant(data.uuid), data);
            setEditingRestaurantIds?.((prev) => prev.filter((id) => id !== restaurantId));
        },
        onError: () => {
            setErrorMessage('Failed to update restaurant. Please try again.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        run(async () => {
            const bothFilled = coords.lat.trim() !== '' && coords.lng.trim() !== '';
            const payload: CreateRestaurant = bothFilled
                ? {
                    ...form,
                    coordinates: { lat: coords.lat.trim(), lng: coords.lng.trim() },
                }
                : {
                    ...form,
                };

            if (isEditMode) {
                editRestaurantMutation.mutate({ uuid: restaurantId!, payload });
            } else {
                addRestaurantMutation.mutate(payload);
            }

            await queryClient.invalidateQueries({ queryKey: queryKeys.restaurants() });
            if (isEditMode) setEditingRestaurantIds?.((prev) => prev.filter((id) => id !== restaurantId));
            else setIsAddingRestaurant?.(false);
        }, 'Failed to save restaurant.');
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <Subtitle>{isEditMode ? 'Edit restaurant' : 'Create a new restaurant'}</Subtitle>

            <FormStack>
                <FieldGroup>
                    <FieldLabel htmlFor="title">Restaurant name</FieldLabel>
                    <Input
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleTextChange}
                        required
                        maxLength={30}
                    />
                </FieldGroup>

                <FieldGroup>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleTextareaChange}
                        required
                        rows={3}
                        maxLength={80}
                    />
                </FieldGroup>

                <Row>
                    <FieldGroup>
                        <FieldLabel htmlFor="lat">Latitude (optional)</FieldLabel>
                        <Input
                            id="lat"
                            name="lat"
                            value={coords.lat}
                            onChange={handleCoordChange}
                            placeholder="e.g. 40.7128"
                            inputMode="decimal"
                        />
                    </FieldGroup>
                    <FieldGroup>
                        <FieldLabel htmlFor="lng">Longitude (optional)</FieldLabel>
                        <Input
                            id="lng"
                            name="lng"
                            value={coords.lng}
                            onChange={handleCoordChange}
                            placeholder="e.g. -74.0060"
                            inputMode="decimal"
                        />
                    </FieldGroup>
                </Row>

                <FieldGroup>
                    <FieldLabel htmlFor="cuisine">Cuisine</FieldLabel>
                    <NativeSelect
                        id="cuisine"
                        value={form.cuisine}
                        onChange={handleCuisineChange}
                        required
                    >
                        {CUISINE_OPTIONS.map((c) => (
                            <option key={c} value={c}>
                                {capitalize(c)}
                            </option>
                        ))}
                    </NativeSelect>
                </FieldGroup>

                <FormFeedback
                    successMessage={successMessage}
                    errorMessage={errorMessage}
                    onClearSuccess={() => setSuccessMessage(null)}
                    onClearError={() => setErrorMessage(null)}
                />

                <Row>
                    <PrimaryButton
                        type="submit"
                        disabled={isSubmitting || !form.title || !form.description}
                    >
                        {isSubmitting ? 'Saving...' : isEditMode ? 'Save changes' : 'Create Restaurant'}
                    </PrimaryButton>
                    <OutlinedButton
                        type="button"
                        onClick={() => {
                            setForm(EMPTY_FORM);
                            setCoords(EMPTY_COORDS);
                            setSuccessMessage(null);
                            setErrorMessage(null);
                            setEditingRestaurantIds?.((prev) => prev.filter((id) => id !== restaurantId));
                        }}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </OutlinedButton>
                </Row>
            </FormStack>
        </form>
    );
};
