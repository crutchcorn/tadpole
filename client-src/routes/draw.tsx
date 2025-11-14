import { createFileRoute } from "@tanstack/react-router";
import { DrawPage } from "../views/draw/draw-page";

export const Route = createFileRoute("/draw")({
  component: Index,
});

function Index() {
  return <DrawPage />;
}
