import {z } from "zod";

const UploadSVGSchema = z.object({
    type: z.literal("upload-svg"),
    svg: z.string(),
});

// The type of messages sent from the client to the server via WebSocket
export const FromClientSocketMessageSchema = z.union([
    UploadSVGSchema,
]);

export type FromClientSocketMessage = z.infer<typeof FromClientSocketMessageSchema>;

const SVGUploadedSchema = z.object({
    type: z.literal("svg_uploaded"),
    svgPath: z.string(),
});

// The type of messages sent from the server to the client via WebSocket
export const FromServerSocketMessageSchema = z.union([
    SVGUploadedSchema,
]);

export type FromServerSocketMessage = z.infer<typeof FromServerSocketMessageSchema>;