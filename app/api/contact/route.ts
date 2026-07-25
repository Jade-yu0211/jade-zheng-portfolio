import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json(
      { success: false, message: "Contact form is not configured." },
      { status: 503 },
    );
  }

  const incoming = await request.formData();
  const payload = new FormData();

  payload.set("access_key", accessKey);
  payload.set("subject", "来自 Jade Zheng 个人网站的新留言");
  payload.set("from_name", "Jade Zheng 个人网站");

  for (const field of ["name", "email", "message", "botcheck"]) {
    const value = incoming.get(field);
    if (value !== null) {
      payload.set(field, value);
    }
  }

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: payload,
  });
  const result = (await response.json()) as {
    success?: boolean;
    message?: string;
  };

  return NextResponse.json(result, { status: response.status });
}
