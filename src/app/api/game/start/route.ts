import { NextResponse } from 'next/server';
import {startGame} from '@/RL/rl';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const policy = searchParams.get('policy');
    const usePolicy = policy === 'true' ? true : false;
    console.log('Starting game with policy:', usePolicy);
    startGame(usePolicy);
    return NextResponse.json({ message: 'Game Started!' });
}