import type { Request, Response } from "express";
export declare const getAdminStats: (req: Request, res: Response) => Promise<void>;
export declare const getDeliveryPartners: (req: Request, res: Response) => Promise<void>;
export declare const createDeliveryPartners: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateDeliveryPartners: (req: Request, res: Response) => Promise<void>;
export declare const assignDeliveryPartners: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=adminController.d.ts.map