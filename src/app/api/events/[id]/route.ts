import connectDB from "../../../../lib/db";
import Event from "../../../../models/Event";
import { requireAdmin } from "../../../../lib/requireAuth";

type Params = { params: { id: string } };

export async function GET(req: Request, { params }: Params) {
  try {
    await connectDB();
    const ev = await Event.findById(params.id).lean();
    if (!ev) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    return new Response(JSON.stringify(ev), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await requireAdmin(req);
    await connectDB();
    const body = await req.json();
    const updated = await Event.findByIdAndUpdate(params.id, body, { new: true }).lean();
    if (!updated) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await requireAdmin(req);
    await connectDB();
    await Event.findByIdAndDelete(params.id);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
