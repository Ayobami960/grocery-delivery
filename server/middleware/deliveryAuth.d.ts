import type { NextFunction, Request, Response } from "express";
declare const deliveryAuth: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default deliveryAuth;
//# sourceMappingURL=deliveryAuth.d.ts.map