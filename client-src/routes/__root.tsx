import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";

const RootLayout = () => (
  <div className={`font-awexbmp bg-[url(/FrogBackgroundP.png)] bg-cover bg-center bg-no-repeat w-vw h-dvh`}>
    <Outlet />
    <TanStackDevtools
      plugins={[
        {
          name: "TanStack Query",
          render: <ReactQueryDevtoolsPanel />,
          defaultOpen: true,
        },
        {
          name: "TanStack Router",
          render: <TanStackRouterDevtoolsPanel />,
          defaultOpen: false,
        },
      ]}
    />{" "}
  </div>
);

export const Route = createRootRoute({ component: RootLayout });
