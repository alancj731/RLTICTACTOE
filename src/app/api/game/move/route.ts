import { NextResponse } from 'next/server';
import {userInput} from '@/RL/rl';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const x = searchParams.get('x');
    const y = searchParams.get('y');
    if (x === null || y === null) {
        return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }
    const result = await userInput(parseInt(x), parseInt(y));
    console.log(result);
    return NextResponse.json(result);

}