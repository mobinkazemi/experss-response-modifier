import { Request, Response, NextFunction } from "express";

type RenameConfig = Record<string, string>;
type RemoveConfig = string[];

export interface ResponseModifierOptions {
    renames?: RenameConfig;
    removes?: RemoveConfig;
}

const primaryTypes = ["string", "number", "boolean", "undefined"] as const;


function modifyData(
    data: unknown,
    renames: RenameConfig,
    removes: RemoveConfig
): unknown {
    if (primaryTypes.includes(typeof data as any) || data === null) {
        return data;
    }

    if (Array.isArray(data)) {
        return data.map(item => modifyData(item, renames, removes));
    }

    if (typeof data === "object") {
        const result: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(data)) {
            if (removes.includes(key)) continue;

            const newKey = renames[key] || key;

            result[newKey] = modifyData(value, renames, removes);
        }

        return result;
    }

    return data;
}


export function createResponseModifierMiddleware(options: ResponseModifierOptions) {
    const renames = options.renames || {};
    const removes = options.removes || [];

    return function responseModifierMiddleware(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const originalJson = res.json.bind(res);

        res.json = (body: any) => {
            const modifiedBody = modifyData(body, renames, removes);
            return originalJson(modifiedBody);
        };

        next();
    };
}


