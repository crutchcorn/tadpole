import { createFileRoute } from "@tanstack/react-router";
import UserToolbar from "../views/room/UserToolbar";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative w-full h-full p-2 font-awexbmp">
      <h3 className="">Welcome Home!</h3>
      <UserToolbar />
    </div>
  );
}
