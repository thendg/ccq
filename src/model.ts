import { z } from "zod"

export const AddressSchema = z.string().startsWith("0x").length(42);
export const PrivateKeySchema = z.string().length(64);
export const HTTPSURLSchema = z.string().startsWith("https://")

export const CCQDataSchema = z.object({
    address: AddressSchema,
    rpcAPIURL: HTTPSURLSchema,
    privateKey: PrivateKeySchema,
    method: z.string(),
    args: z.array(z.string()),
    type: z.union([z.literal("query"), z.literal("command")]),
    abi: z.array(z.any()),
    value: z.number().min(0).default(0) // TODO, make optional without allowing undefined
})
export type CCQData = z.infer<typeof CCQDataSchema>