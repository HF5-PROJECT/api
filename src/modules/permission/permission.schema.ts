import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const permissionCore = {
    name: z.string({
        required_error: "Permission name is required",
        invalid_type_error: "Name must be an string",
    }),
};

const getPermissionResponseSchema = z.object({
    id: z.number(),
    ...permissionCore,
});

const getAllPermissionsResponseSchema = z.array(getPermissionResponseSchema);

export const permissionSchema = getPermissionResponseSchema;

export const { schemas: permissionSchemas, $ref } = buildJsonSchemas(
    {
        getPermissionResponseSchema,
        getAllPermissionsResponseSchema,
    },
    {
        $id: "permissionSchema",
    }
);
