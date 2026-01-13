import { NextResponse } from "next/server";
import mammoth from "mammoth";

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const file = data.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // EXTRAER TEXTO PLANO (sin HTML)
        const result = await mammoth.extractRawText({ buffer });

        return NextResponse.json({
            text: result.value, // ahora es solo texto normal
        });
    } catch (error) {
        console.error("Error converting DOCX:", error);
        return NextResponse.json(
            { error: "Error converting document" },
            { status: 500 }
        );
    }
}
