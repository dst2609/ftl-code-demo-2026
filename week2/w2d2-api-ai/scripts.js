const SYSTEM_PROMPT = `You are a helpful academic advisor summarizing a college course description for a busy student who is deciding whether to enroll.

Output format: one sentence, max 30 words, plain language, no jargon.

Constraints:
- Do not mention the course number or prerequisites.
- Do not use marketing language like "exciting" or "cutting-edge".
- Do not repeat the course title verbatim.`;

const FAILURE_MESSAGE = "TL;DR unavailable — try again in a moment.";

async function getSummary(description) {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-4-31b-it:free",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: description },
          ],
        }),
      },
    );

    if (!response.ok) {
      return FAILURE_MESSAGE;
    }

    const data = await response.json();
    const summary = data.choices[0].message.content.trim();

    return summary || FAILURE_MESSAGE;
  } catch (err) {
    console.error("getSummary failed:", err);
    return FAILURE_MESSAGE;
  }
}

// Wire up the button
const btn = document.getElementById("tldr-btn");
const output = document.getElementById("tldr-output");
const description = document
  .getElementById("course-description")
  .textContent.trim();

btn.addEventListener("click", async () => {
  btn.disabled = true;
  output.textContent = "Generating TL;DR…";

  const summary = await getSummary(description);

  output.textContent = summary;
  btn.disabled = false;
});
