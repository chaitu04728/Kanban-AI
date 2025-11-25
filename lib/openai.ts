import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn("OPENAI_API_KEY is not defined in environment variables.");
}

export const openai = new OpenAI({
  apiKey: apiKey || "dummy-key",
});

export async function generateReleaseNotes(
  sprintName: string,
  tasks: { title: string; status: string; description?: string }[]
) {
  if (!apiKey) return "OpenAI API key not configured.";

  const prompt = `
    Generate professional release notes for Sprint "${sprintName}".
    
    Here are the tasks in this sprint:
    ${tasks
      .map(
        (t) =>
          `- [${t.status}] ${t.title}${
            t.description ? `: ${t.description.substring(0, 100)}...` : ""
          }`
      )
      .join("\n")}

    Format the release notes in Markdown.
    Group them by:
    - 🚀 New Features (for completed tasks that look like features)
    - 🐛 Bug Fixes (for completed tasks that look like bugs)
    - 🚧 In Progress (for tasks not yet completed)
    
    Keep it concise and exciting.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful product manager assistant that writes great release notes.",
      },
      { role: "user", content: prompt },
    ],
  });

  return response.choices[0].message.content;
}
