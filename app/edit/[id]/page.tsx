'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

async function fetchPost(id: string) {
    const res = await fetch(`/api/posts/${id}`);
    if (!res.ok) throw new Error('Failed to fetch post');
    return res.json();
}

async function updatePost(id: string, data: FormData) {
    const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}

export default function EditPostPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['post', params.id],
        queryFn: () => fetchPost(params.id),
    });

    const { register, handleSubmit, setValue, formState } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const mutation = useMutation({
        mutationFn: (data: FormData) => updatePost(params.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            router.push('/');
        },
    });

    if (isLoading) return <p className="text-center mt-10">Loading...</p>;

    // إعداد القيم الأولية
    if (data) {
        setValue('title', data.title);
        setValue('content', data.content || '');
    }

    const onSubmit = (data: FormData) => mutation.mutate(data);

    return (
        <main className="max-w-md mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">✏️ Edit Post</h1>
            <form onSubmit={ handleSubmit(onSubmit) } className="space-y-3">
                <input
                    { ...register('title') }
                    className="border p-2 w-full rounded"
                    placeholder="Title"
                />
                { formState.errors.title && (
                    <p className="text-red-500 text-sm">
                        { formState.errors.title.message }
                    </p>
                ) }
                <textarea
                    { ...register('content') }
                    className="border p-2 w-full rounded"
                    rows={ 4 }
                    placeholder="Content"
                />
                <button
                    type="submit"
                    disabled={ mutation.isPending }
                    className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    { mutation.isPending ? 'Updating...' : 'Update' }
                </button>
            </form>
        </main>
    );
}
