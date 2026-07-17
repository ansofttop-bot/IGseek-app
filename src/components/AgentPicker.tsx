import type { Agent } from "~/lib/agents";

interface Props {
  agents: Agent[];
  selected: Agent;
  onSelect: (agent: Agent) => void;
  onClose: () => void;
}

export function AgentPicker({ agents, selected, onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-2xl bg-card border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Выберите агента</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-secondary transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onSelect(agent)}
              className={`w-full rounded-xl p-4 text-left transition-colors ${
                selected.id === agent.id
                  ? "bg-primary/10 border border-primary/30 text-foreground"
                  : "bg-secondary border border-transparent hover:bg-accent text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{agent.icon}</span>
                <div>
                  <div className="font-medium">{agent.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {agent.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
