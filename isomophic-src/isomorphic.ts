import { z } from "zod";

const UploadSVGSchema = z.object({
    type: z.literal("upload-svg"),
    svg: z.string(),
});

export const FrogSchema = z.union([
    z.literal("Frog1AP"),
    z.literal("Frog1BP"),
    z.literal("Frog1CP"),
    z.literal("Frog2AP"),
    z.literal("Frog2BP"),
    z.literal("Frog2CP"),
    z.literal("Frog3AP"),
    z.literal("Frog3BP"),
    z.literal("Frog3CP"),
    z.literal("Frog4AP"),
    z.literal("Frog4BP"),
    z.literal("Frog4CP"),
    z.literal("Frog5AP"),
    z.literal("Frog5BP"),
    z.literal("Frog5CP"),
])

export type Frog = z.infer<typeof FrogSchema>;

export const HatSchema = z.union([
    z.literal(""),
    z.literal("CrownGoldP"),
    z.literal("CrownSilverP"),
    z.literal("CrownLordOfFliesP"),
    z.literal("FliesHatP"),
    z.literal("PaperHatP"),
    z.literal("PrincessHatP"),
    z.literal("PropellorHatP"),
    z.literal("TopHatP"),
    z.literal("UmbrellaHatP"),
    z.literal("WizardHatP"),
    z.literal("BucketHatP"),
    z.literal("FroggyHatP"),
]);

export type Hat = z.infer<typeof HatSchema>;

const ChangeFrogSchema = z.object({
    type: z.literal("change-frog"),
    hat: HatSchema,
    frog: FrogSchema,
});

// The type of messages sent from the client to the server via WebSocket
export const FromClientSocketMessageSchema = z.union([
    UploadSVGSchema,
    ChangeFrogSchema,
]);

export type FromClientSocketMessage = z.infer<typeof FromClientSocketMessageSchema>;

const SVGUploadedSchema = z.object({
    type: z.literal("svg_uploaded"),
    hat: HatSchema,
    frog: FrogSchema,
    svgPath: z.string(),
});

const FrogChangedSchema = z.object({
    type: z.literal("frog_changed"),
    hat: HatSchema,
    frog: FrogSchema,
});

// The type of messages sent from the server to the client via WebSocket
export const FromServerSocketMessageSchema = z.union([
    SVGUploadedSchema,
    FrogChangedSchema,
]);

export type FromServerSocketMessage = z.infer<typeof FromServerSocketMessageSchema>;