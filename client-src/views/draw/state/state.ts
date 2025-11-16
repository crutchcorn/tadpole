import * as React from "react";
import type { Doc, DrawShape, DrawStyles, State } from "./types";
import { TLPointerEventHandler, TLShapeUtilsMap, Utils } from "@tldraw/core";
import { Vec } from "@tldraw/vec";
import { StateManager } from "rko";
import { draw, DrawUtil } from "./shapes";
import sample from "./sample.json";
import type { StateSelector } from "zustand";

export const shapeUtils: TLShapeUtilsMap<DrawShape> = {
  draw: new DrawUtil(),
};

export const initialDoc: Doc = {
  page: {
    id: "page",
    shapes: {},
    bindings: {},
  },
  pageState: {
    id: "page",
    selectedIds: [],
    camera: {
      point: [0, 0],
    },
  },
};

export const defaultStyle: DrawStyles = {
  size: 16,
  strokeWidth: 0,
  isFilled: true,
  fill: "#000000",
  stroke: "#000000",
};

export const initialState: State = {
  appState: {
    status: "idle",
    tool: "drawing",
    editingId: undefined,
    style: defaultStyle,
    isPanelOpen: true,
  },
  ...initialDoc,
};

export const context = React.createContext<AppState>({} as AppState);

export class AppState extends StateManager<State> {
  shapeUtils = shapeUtils;

  log = false;

  currentStroke = {
    startTime: 0,
  };

  onReady = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window["app"] = this;
  };

  cleanup = (state: State) => {
    for (const id in state.page.shapes) {
      if (!state.page.shapes[id]) {
        delete state.page.shapes[id];
      }
    }

    return state;
  };

  onPointerDown: TLPointerEventHandler = (info) => {
    const { state } = this;

    switch (state.appState.tool) {
      case "drawing": {
        this.createDrawingShape(info.point);
        break;
      }
    }
  };

  onPointerMove: TLPointerEventHandler = (info, event) => {
    if (event.buttons > 1) return;

    const { status, tool } = this.state.appState;

    switch (tool) {
      case "drawing": {
        if (status === "drawing") {
          const nextShape = this.updateDrawingShape(info.point, info.pressure);
          if (nextShape) {
            this.patchState({
              page: {
                shapes: {
                  [nextShape.id]: nextShape,
                },
              },
            });
          }
        }
        break;
      }
    }
  };

  onPointerUp: TLPointerEventHandler = () => {
    const { state } = this;
    switch (state.appState.tool) {
      case "drawing": {
        this.completeDrawingShape();
        break;
      }
    }
  };

  /* --------------------- Methods -------------------- */

  togglePanelOpen = () => {
    const { state } = this;
    this.patchState({
      appState: {
        isPanelOpen: !state.appState.isPanelOpen,
      },
    });
  };

  createDrawingShape = (point: number[]) => {
    const { state } = this;

    const camera = state.pageState.camera;

    const pt = Vec.sub(point, camera.point);

    const shape = draw.create({
      id: Utils.uniqueId(),
      point: pt,
      style: state.appState.style,
      points: [[0, 0, 0.5, 0]],
      isDone: false,
    });

    this.currentStroke.startTime = Date.now();

    return this.patchState({
      appState: {
        status: "drawing",
        editingId: shape.id,
      },
      page: {
        shapes: {
          [shape.id]: shape,
        },
      },
    });
  };

  updateDrawingShape = (point: number[], pressure: number) => {
    const { state, currentStroke } = this;
    if (state.appState.status !== "drawing") return;
    if (!state.appState.editingId) return;

    const shape = state.page.shapes[state.appState.editingId];

    const camera = state.pageState.camera;

    const newPoint = [
      ...Vec.sub(Vec.round(Vec.sub(point, camera.point)), shape.point),
      pressure,
      Date.now() - currentStroke.startTime,
    ];

    let shapePoint = shape.point;

    let shapePoints = [...shape.points, newPoint];

    // Does the new point create a negative offset?
    const offset = [Math.min(newPoint[0], 0), Math.min(newPoint[1], 0)];

    if (offset[0] < 0 || offset[1] < 0) {
      // If so, then we need to move the shape to cancel the offset
      shapePoint = [
        ...Vec.round(Vec.add(shapePoint, offset)),
        shapePoint[2],
        shapePoint[3],
      ];

      // And we need to move the shape points to cancel the offset
      shapePoints = shapePoints.map((pt) =>
        Vec.round(Vec.sub(pt, offset)).concat(pt[2], pt[3]),
      );
    }

    return {
      id: shape.id,
      point: shapePoint,
      points: shapePoints,
    };
  };

  completeDrawingShape = () => {
    const { state } = this;
    const { shapes } = state.page;
    if (!state.appState.editingId) return this;

    let shape = shapes[state.appState.editingId];

    shape.isDone = true;

    shape = {
      ...shape,
    };

    return this.setState({
      before: {
        appState: {
          status: "idle",
          editingId: undefined,
        },
        page: {
          shapes: {
            [shape.id]: undefined,
          },
        },
      },
      after: {
        appState: {
          status: "idle",
          editingId: undefined,
        },
        page: {
          shapes: {
            [shape.id]: shape,
          },
        },
      },
    });
  };

  centerShape = (id: string) => {
    const shape = this.state.page.shapes[id];
    const bounds = shapeUtils.draw.getBounds(this.state.page.shapes[id]);
    this.patchState({
      pageState: {
        camera: {
          point: Vec.add(shape.point, [
            window.innerWidth / 2 - bounds.width / 2,
            window.innerHeight / 2 - bounds.height / 2,
          ]),
        },
      },
    });
  };

  patchStyle = (style: Partial<DrawStyles>) => {
    return this.patchState({
      appState: {
        style,
      },
    });
  };

  finishStyleUpdate = () => {
    const { state, snapshot } = this;
    const { shapes } = state.page;

    return this.setState({
      before: snapshot,
      after: {
        appState: {
          style: state.appState.style,
        },
        page: {
          shapes: {
            ...Object.fromEntries(
              Object.entries(shapes).map(([id, { style }]) => [id, { style }]),
            ),
          },
        },
      },
    });
  };

  copySvg = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    const shapes = Object.values(this.state.page.shapes);

    const bounds = Utils.getCommonBounds(shapes.map(draw.getBounds));

    const padding = 40;

    shapes.forEach((shape) => {
      const fillElm = document.getElementById("path_" + shape.id);

      if (!fillElm) return;

      const fillClone = fillElm.cloneNode(false) as SVGPathElement;

      const strokeElm = document.getElementById("path_stroke_" + shape.id);

      if (strokeElm) {
        // Create a new group
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

        // Translate the group to the shape's point
        g.setAttribute(
          "transform",
          `translate(${shape.point[0]}, ${shape.point[1]})`,
        );

        // Clone the stroke element
        const strokeClone = strokeElm.cloneNode(false) as SVGPathElement;

        // Append both the stroke element and the fill element to the group
        g.appendChild(strokeClone);
        g.appendChild(fillClone);

        // Append the group to the SVG
        svg.appendChild(g);
      } else {
        // Translate the fill clone and append it to the SVG
        fillClone.setAttribute(
          "transform",
          `translate(${shape.point[0]}, ${shape.point[1]})`,
        );

        svg.appendChild(fillClone);
      }
    });

    // Resize the element to the bounding box
    svg.setAttribute(
      "viewBox",
      [
        bounds.minX - padding,
        bounds.minY - padding,
        bounds.width + padding * 2,
        bounds.height + padding * 2,
      ].join(" "),
    );

    svg.setAttribute("width", String(bounds.width));

    svg.setAttribute("height", String(bounds.height));

    const s = new XMLSerializer();

    const svgString = s
      .serializeToString(svg)
      .replaceAll("&#10;      ", "")
      .replaceAll(/((\s|")[0-9]*\.[0-9]{2})([0-9]*)(\b|"|\))/g, "$1");

    return svgString;
  };

  resetDoc = () => {
    const { shapes } = this.state.page;

    return this.setState({
      before: {
        page: {
          shapes,
        },
      },
      after: {
        page: {
          shapes: {
            ...Object.fromEntries(
              Object.keys(shapes).map((key) => [key, undefined]),
            ),
          },
        },
        pageState: {
          camera: {
            point: [0, 0],
          },
        },
      },
    });
  };
}

export const app = new AppState(
  initialState,
  "perfect-freehand",
  1,
  (p, n) => n,
);

export function useAppState(): State;
export function useAppState<K>(selector: StateSelector<State, K>): K;
export function useAppState<K>(selector?: StateSelector<State, K>) {
  if (selector) {
    return app.useStore(selector);
  }
  return app.useStore();
}
