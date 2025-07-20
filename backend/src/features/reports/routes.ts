import {Request, Response, Router} from 'express';
import {ReportService} from './service';
import {authMiddleware} from '../../middleware/auth';
import {validateUUID} from '../../utils/validator';
import {handleValidationErrors} from "../../utils/errorHandler";
import {query} from 'express-validator';

const router = Router();
const reportService = new ReportService();

router.get(
    '/sales/:restaurantId',
    [
        validateUUID('restaurantId'),
        query('start_date').optional().isISO8601().withMessage('Data inicial deve ser um formato ISO 8601 válido'),
        query('end_date').optional().isISO8601().withMessage('Data final deve ser um formato ISO 8601 válido'),
        query('format').optional().isIn(['json', 'pdf', 'csv']).withMessage('Formato deve ser json, pdf ou csv'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const filter = {
                start_date: req.query.start_date as string,
                end_date: req.query.end_date as string,
            };
            const report = await reportService.generateSalesReport(req.params.restaurantId, (req as any).userId, filter);

            const format = req.query.format as string | undefined;
            if (format === 'pdf') {
                const pdfBuffer = await reportService.generateSalesReportPDF(report);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=sales_report.pdf');
                return res.send(pdfBuffer);
            } else if (format === 'csv') {
                const csvContent = await reportService.generateSalesReportCSV(report);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=sales_report.csv');
                return res.send(csvContent);
            }

            res.json(report);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/occupancy/:restaurantId',
    [
        validateUUID('restaurantId'),
        query('start_date').optional().isISO8601().withMessage('Data inicial deve ser um formato ISO 8601 válido'),
        query('end_date').optional().isISO8601().withMessage('Data final deve ser um formato ISO 8601 válido'),
        query('format').optional().isIn(['json', 'pdf', 'csv']).withMessage('Formato deve ser json, pdf ou csv'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const filter = {
                start_date: req.query.start_date as string,
                end_date: req.query.end_date as string,
            };
            const report = await reportService.generateOccupancyReport(req.params.restaurantId, (req as any).userId, filter);

            const format = req.query.format as string | undefined;
            if (format === 'pdf') {
                const pdfBuffer = await reportService.generateOccupancyReportPDF(report);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=occupancy_report.pdf');
                return res.send(pdfBuffer);
            } else if (format === 'csv') {
                const csvContent = await reportService.generateOccupancyReportCSV(report);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=occupancy_report.csv');
                return res.send(csvContent);
            }

            res.json(report);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/inventory/:restaurantId',
    [
        validateUUID('restaurantId'),
        query('start_date').optional().isISO8601().withMessage('Data inicial deve ser um formato ISO 8601 válido'),
        query('end_date').optional().isISO8601().withMessage('Data final deve ser um formato ISO 8601 válido'),
        query('format').optional().isIn(['json', 'pdf', 'csv']).withMessage('Formato deve ser json, pdf ou csv'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const filter = {
                start_date: req.query.start_date as string,
                end_date: req.query.end_date as string,
            };
            const report = await reportService.generateInventoryReport(req.params.restaurantId, (req as any).userId, filter);

            const format = req.query.format as string | undefined;
            if (format === 'pdf') {
                const pdfBuffer = await reportService.generateInventoryReportPDF(report);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=inventory_report.pdf');
                return res.send(pdfBuffer);
            } else if (format === 'csv') {
                const csvContent = await reportService.generateInventoryReportCSV(report);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=inventory_report.csv');
                return res.send(csvContent);
            }

            res.json(report);
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;