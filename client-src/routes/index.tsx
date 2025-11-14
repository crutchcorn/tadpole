import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2 font-awexbmp">
      <h3 className="">Welcome Home!</h3>
    </div>
  );
}
