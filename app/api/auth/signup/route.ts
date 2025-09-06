import { prisma } from '../../../../lib/prisma';
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, } = body;

    if (!email || !password || !name ) {
      return new Response(
        JSON.stringify({ error: 'Missing fields' }),
        { status: 400 }
      );
    }

    // check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { status: 400 }
      );
    }



    const hashed = await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });

    return new Response(
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
      }),
      { status: 201 }
    );
  } catch (err: any) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}