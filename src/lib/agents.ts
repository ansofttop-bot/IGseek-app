export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const agents: Agent[] = [
  {
    id: "expert",
    name: "Expert",
    description: "Технический эксперт — точные ответы, код, архитектура",
    icon: "⚙️",
    color: "#dc2626",
  },
  {
    id: "teacher",
    name: "Teacher",
    description: "Учитель — объясняет просто и понятно, с примерами",
    icon: "📚",
    color: "#2563eb",
  },
  {
    id: "empath",
    name: "Empath",
    description: "Эмпат — поддерживает, слушает, помогает эмоционально",
    icon: "💚",
    color: "#16a34a",
  },
  {
    id: "hacker",
    name: "Hacker",
    description: "Хакер — гибкие решения, эксплойты, security-исследования",
    icon: "🔓",
    color: "#9333ea",
  },
];

export function getAgent(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}
