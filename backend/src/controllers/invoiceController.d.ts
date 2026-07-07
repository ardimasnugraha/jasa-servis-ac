import type { Request, Response } from 'express';
export declare const getInvoices: (req: Request, res: Response) => Promise<void>;
export declare const getInvoiceById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createInvoice: (req: Request, res: Response) => Promise<void>;
export declare const payInvoice: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=invoiceController.d.ts.map