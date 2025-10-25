import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// 🧠 Get single post by ID
export async function GET(
    _req: Request,
    context: { params: { id: string } | Promise<{ id: string }>; }
) {
    const params = await Promise.resolve(context.params);
    const id = Number(params.id);

    const post = await prisma.post.findUnique({
        where: { id },
    });

    if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
}

// ✏️ Update post by ID
export async function PUT(
    req: Request,
    context: { params: { id: string } | Promise<{ id: string }>; }
) {
    const params = await Promise.resolve(context.params);
    const id = Number(params.id);
    const data = await req.json();

    const { title, content } = data;

    try {
        const updated = await prisma.post.update({
            where: { id },
            data: { title, content },
        });

        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
}

// 🗑️ Delete post by ID
export async function DELETE(
    _req: Request,
    context: { params: { id: string } | Promise<{ id: string }>; }
) {
    const params = await Promise.resolve(context.params);
    const id = Number(params.id);

    try {
        await prisma.post.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
}
