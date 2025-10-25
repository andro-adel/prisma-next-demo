'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

async function createPost(data: FormData) {
    const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
}

export default function NewPostPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const mutation = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            router.push('/');
        },
    });

    const onSubmit = (data: FormData) => mutation.mutate(data);

    return (
        <main className="max-w-md mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">🆕 New Post</h1>
            <form onSubmit={ handleSubmit(onSubmit) } className="space-y-3">
                <input
                    { ...register('title') }
                    placeholder="Title"
                    className="border p-2 w-full rounded"
                />
                { formState.errors.title && (
                    <p className="text-red-500 text-sm">
                        { formState.errors.title.message }
                    </p>
                ) }
                <textarea
                    { ...register('content') }
                    placeholder="Content"
                    className="border p-2 w-full rounded"
                    rows={ 4 }
                />
                <button
                    disabled={ mutation.isPending }
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    { mutation.isPending ? 'Saving...' : 'Save' }
                </button>
            </form>
        </main>
    );
}
