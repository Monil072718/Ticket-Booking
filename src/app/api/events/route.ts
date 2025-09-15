import connectDB from "../../../lib/db";
import Event from "../../../models/Event";
import { requireAdmin } from "../../../lib/requireAuth";

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ date: 1 }).lean();
    return new Response(JSON.stringify(events), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
 


export async function POST(req: Request) {
  try {
    await requireAdmin(req); // only admin can create
    await connectDB();

    const body = await req.json();
    const event = await Event.create(body);

    return new Response(JSON.stringify(event), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
