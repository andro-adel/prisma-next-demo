import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 🧩 GET - جلب كل المقالات
export async function GET() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
}

// 🧩 POST - إنشاء مقال جديد
export async function POST(req: Request) {
    const data = await req.json();
    const { title, content } = data;

    if (!title) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const newPost = await prisma.post.create({
        data: { title, content },
    });

    return NextResponse.json(newPost);
}
