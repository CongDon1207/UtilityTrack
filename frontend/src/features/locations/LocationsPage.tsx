import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLocation, getLocations, deleteLocation, updateLocation } from '../../api/locations';
import type { CreateLocationInput, LocationType, Location } from '../../types/location';

const locationTypes: LocationType[] = [
    'home',
    'office',
    'factory',
    'warehouse',
    'rental_room',
    'other',
];

export function LocationsPage() {
    const queryClient = useQueryClient();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingLocationId, setEditingLocationId] = useState<number | null>(null)
    const [formData, setFormData] = useState<CreateLocationInput>({
        name: '',
        code: '',
        type: 'office',
        address: '',
    });




    const {
        data: locations = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['locations'],
        queryFn: getLocations,
    });

    const createMutation = useMutation({
        mutationFn: createLocation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            setFormData({
                name: '',
                code: '',
                type: 'office',
                address: '',
            });
            setIsFormOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            input,
        }: {
            id: number;
            input: CreateLocationInput;
        }) => updateLocation(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            setFormData({
                name: '',
                code: '',
                type: 'office',
                address: '',
            });
            setEditingLocationId(null);
            setIsFormOpen(false);
        },
    });


    const deleteMutation = useMutation({
        mutationFn: deleteLocation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
    });


    const activeCount = locations.filter((location) => location.isActive).length;

    function startEdit(location: Location) {
        setEditingLocationId(location.id);
        setFormData({
            name: location.name,
            code: location.code ?? '',
            type: location.type,
            address: location.address ?? '',
        });
        setIsFormOpen(true);
    }


    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const input = {
            name: formData.name,
            code: formData.code || undefined,
            type: formData.type,
            address: formData.address || undefined,
        };

        if (editingLocationId) {
            updateMutation.mutate({
                id: editingLocationId,
                input,
            });
            return;
        }

        createMutation.mutate(input);
    }


    if (isLoading) {
        return (
            <main className="p-6">
                <p className="text-sm text-slate-600">Loading locations...</p>
            </main>
        );
    }

    if (isError) {
        return (
            <main className="p-6">
                <p className="text-sm text-red-600">Could not load locations.</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Locations</h1>
                        <p className="mt-1 text-sm text-slate-600">
                            Manage places used for utility tracking.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsFormOpen((current) => !current)}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        {isFormOpen ? 'Cancel' : 'Add Location'}
                    </button>
                </div>

                {isFormOpen && (
                    <form
                        onSubmit={handleSubmit}
                        className="mb-4 rounded-lg border border-slate-200 bg-white p-4"
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="text-sm font-medium text-slate-700">
                                Name
                                <input
                                    value={formData.name}
                                    onChange={(event) =>
                                        setFormData((current) => ({
                                            ...current,
                                            name: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                                    required
                                />
                            </label>

                            <label className="text-sm font-medium text-slate-700">
                                Code
                                <input
                                    value={formData.code}
                                    onChange={(event) =>
                                        setFormData((current) => ({
                                            ...current,
                                            code: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                                />
                            </label>

                            <label className="text-sm font-medium text-slate-700">
                                Type
                                <select
                                    value={formData.type}
                                    onChange={(event) =>
                                        setFormData((current) => ({
                                            ...current,
                                            type: event.target.value as LocationType,
                                        }))
                                    }
                                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                                >
                                    {locationTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="text-sm font-medium text-slate-700">
                                Address
                                <input
                                    value={formData.address}
                                    onChange={(event) =>
                                        setFormData((current) => ({
                                            ...current,
                                            address: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                                />
                            </label>
                        </div>

                        {createMutation.isError && (
                            <p className="mt-3 text-sm text-red-600">
                                Could not create location.
                            </p>
                        )}

                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={createMutation.isPending || !formData.name.trim()}
                                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                                {createMutation.isPending ? 'Saving...' : 'Save Location'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-sm text-slate-500">Total locations</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900">
                            {locations.length}
                        </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-sm text-slate-500">Active locations</p>
                        <p className="mt-1 text-2xl font-semibold text-green-700">
                            {activeCount}
                        </p>
                    </div>
                </div>



                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead className="bg-slate-100 text-slate-700">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Code</th>
                                <th className="px-4 py-3 font-medium">Type</th>
                                <th className="px-4 py-3 font-medium">Address</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {locations.map((location) => (
                                <tr key={location.id} className="border-t border-slate-200">
                                    <td className="px-4 py-3 text-slate-900">{location.name}</td>
                                    <td className="px-4 py-3 text-slate-700">
                                        {location.code ?? '-'}
                                    </td>
                                    <td className="px-4 py-3 text-slate-700">{location.type}</td>
                                    <td className="px-4 py-3 text-slate-700">
                                        {location.address ?? '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={
                                                location.isActive
                                                    ? 'text-green-700'
                                                    : 'text-slate-500'
                                            }
                                        >
                                            {location.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(location)}
                                                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => deleteMutation.mutate(location.id)}
                                                disabled={!location.isActive || deleteMutation.isPending}
                                                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                                            >
                                                Disable
                                            </button>
                                        </div>
                                    </td>


                                </tr>
                            ))}

                            {locations.length === 0 && (
                                <tr>
                                    <td className="px-4 py-6 text-slate-500" colSpan={6}>
                                        No locations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
