// 생각식당 화면용 — 삐쿡에게 고민을 보내고 위로 한마디 받기
// 중계 서버(Cloudflare Worker) 주소
const PIYO_CHEF_URL = "https://piyo-chef.piyo-ai-shop.workers.dev";

// API가 멈추거나 크레딧이 떨어졌을 때 나오는 기본 문구
const FALLBACK_LINES = [
  "오늘 하루도 여기까지 온 것만으로 충분히 잘했어요. 삐약! 🐣",
  "푹 끓인 수프처럼, 고민도 시간이 지나면 부드러워져요. 🍲",
  "지금 마음, 삐쿡이 꼭 안아 줄게요. 천천히 가도 괜찮아요. 🐥",
  "작은 한 숟갈부터 시작하면 돼요. 응원할게요! 🥄",
];

function randomFallback() {
  return FALLBACK_LINES[Math.floor(Math.random() * FALLBACK_LINES.length)];
}

async function askPiyoChef(thought) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000); // 12초 넘으면 포기

  try {
    const res = await fetch(PIYO_CHEF_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ thought: String(thought).slice(0, 300) }),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (data.reply) return data.reply;
    if (data.reason === "too_many") {
      return "삐쿡이 지금 요리 중이에요! 잠깐 쉬었다가 다시 들려주세요. 🍳";
    }
    return randomFallback();
  } catch {
    return randomFallback();
  } finally {
    clearTimeout(timer);
  }
}

// 사용 예:
// const reply = await askPiyoChef(inputEl.value);
// replyBubbleEl.textContent = reply;   // innerHTML 말고 textContent로 넣기
