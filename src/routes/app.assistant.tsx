import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, Panel, StatusPill } from "@/components/app-ui";
import { assistantAnswers, assistantPrompts } from "@/lib/mock-data";

export const Route = createFileRoute("/app/assistant")({
  head: () => ({
    meta: [
      { title: "AI Business Assistant — SmartBPI" },
      {
        name: "description",
        content: "Ask business questions and get structured answers with supporting data tables.",
      },
      { property: "og:title", content: "AI Business Assistant — SmartBPI" },
      {
        property: "og:description",
        content: "Conversational answers grounded in your operational data.",
      },
    ],
  }),
  component: Assistant,
});

type Message =
  | { role: "user"; text: string }
  | { role: "assistant"; text: string; answer?: (typeof assistantAnswers)[string] };

const fallback = {
  summary:
    "Here is what the business graph shows for that question. Revenue is trending up 12.4% year over year, while working capital is constrained by $214K of overdue receivables and 6 SKUs below reorder point.",
  table: {
    columns: ["Signal", "Current", "Trend"],
    rows: [
      ["Revenue", "$4.82M", "+12.4%"],
      ["Gross margin", "40.2%", "+0.8pt"],
      ["Overdue AR", "$214.3K", "+8.7%"],
      ["Stock alerts", "17 SKUs", "+5"],
    ],
  },
  note: "Ask about a specific module for a deeper breakdown.",
};

function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Good morning. Revenue is ahead of plan, but two things need you today: $214K of overdue receivables and 6 SKUs below reorder point. Ask me anything.",
    },
  ]);
  const [draft, setDraft] = useState("");

  function ask(question: string) {
    const answer = assistantAnswers[question] ?? fallback;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: question },
      { role: "assistant", text: answer.summary, answer },
    ]);
    setDraft("");
  }

  return (
    <>
      <PageHeader
        eyebrow="09 · AI Business Assistant"
        title="AI Business Assistant"
        description="Ask in plain language and get a structured answer with the data behind it."
      />

      <Panel bodyClassName="p-0" className="flex h-[calc(100vh-17rem)] min-h-[520px] flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {messages.map((message, index) => (
            <div key={index} className={message.role === "user" ? "flex justify-end" : "space-y-3"}>
              {message.role === "user" ? (
                <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  {message.text}
                </p>
              ) : (
                <div className="max-w-[92%] space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-accent-foreground">
                      <Sparkles className="size-3.5" />
                    </span>
                    <p className="rounded-2xl rounded-tl-sm border border-border bg-canvas px-4 py-2.5 text-sm">
                      {message.text}
                    </p>
                  </div>
                  {message.answer ? (
                    <div className="ml-10 space-y-2">
                      <div className="surface-panel overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {message.answer.table.columns.map((column) => (
                                <TableHead key={column}>{column}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {message.answer.table.rows.map((row) => (
                              <TableRow key={row.join("-")}>
                                {row.map((cell, cellIndex) => (
                                  <TableCell
                                    key={cellIndex}
                                    className={cellIndex === 0 ? "font-medium" : "tabular-nums"}
                                  >
                                    {cell}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <p className="text-xs text-muted-foreground">{message.answer.note}</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t border-border p-4">
          <div className="flex flex-wrap gap-2">
            {assistantPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => ask(prompt)}
                className="rounded-full border border-border bg-canvas px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary-soft"
              >
                {prompt}
              </button>
            ))}
          </div>
          <form
            className="flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (draft.trim()) ask(draft.trim());
            }}
          >
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about revenue, stock, cash or customers…"
            />
            <Button type="submit" size="icon" aria-label="Send">
              <Send className="size-4" />
            </Button>
          </form>
          <StatusPill tone="primary">Answers are simulated from mock business data</StatusPill>
        </div>
      </Panel>
    </>
  );
}
