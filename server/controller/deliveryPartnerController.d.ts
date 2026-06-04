import type { Request, Response } from "express";
export declare const loginPartner: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyDeliveries: (req: Request, res: Response) => Promise<void>;
export declare const getMyDeliveriesDetail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const completeDelivery: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const cancelDelivery: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateDeliveryStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateLocation: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=deliveryPartnerController.d.ts.map