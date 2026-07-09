// 서버 전용 라우트 — 여기서만 ANTHROPIC_API_KEY를 사용합니다.
// 브라우저는 절대 이 키를 볼 수 없습니다 (Next.js 서버에서만 실행되는 코드).

export async function POST(req) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "서버에 ANTHROPIC_API_KEY 환경변수가 설정되어 있지 않습니다. .env.local 또는 배포 환경변수를 확인하세요." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const { model, prompt } = body || {};
  if (!model || !prompt) {
    return Response.json({ error: "model과 prompt는 필수입니다." }, { status: 400 });
  }

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
        tools: [{ type: "web_search_20250305", name: "web_search" }],
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      // Anthropic이 반환한 에러 메시지를 그대로 전달 (키 값 자체는 노출되지 않음)
      return Response.json(
        { error: data?.error?.message || `Anthropic API 오류 (HTTP ${anthropicRes.status})` },
        { status: anthropicRes.status }
      );
    }

    return Response.json(data);
  } catch (e) {
    return Response.json({ error: "서버에서 Anthropic API 호출 중 오류가 발생했습니다." }, { status: 500 });
  }
}
