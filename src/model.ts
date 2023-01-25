import { z } from "zod"

export const AddressSchema = z.string().startsWith("0x").length(42);
export const PrivateKeySchema = z.string().length(64);

export const CCQDataSchema = z.object({
    address: AddressSchema,
    rpcAPIUrl: z.string(),
    privateKey: PrivateKeySchema,
    method: z.string(),
    args: z.array(z.string()),
    type: z.union([z.literal("query"), z.literal("command")])
})

