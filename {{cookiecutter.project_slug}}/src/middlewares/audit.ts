import { db } from "@/db";
import { audits } from "@/db/schema";
import { NextFunction } from "express";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';

const auditMiddleware = (resourceType: string) => {
    return (req: any, res: any, next: NextFunction): void => {
        const requestTime = moment();

        // Override the `end` method to capture response data
        const originalEnd = res.end;

        res.end = async (chunk: any, encoding?: BufferEncoding) => {
            const endTime = moment();
            const responseTime = endTime.diff(requestTime);

            // Extract request and response details
            const { method, url, headers, ip, body } = req;
            const userId = req.user?.sub || null; // Adjust based on your authentication
            const statusCode = res.statusCode;

            const responsePayload = chunk ? chunk.toString(encoding || "utf8") : null;
            const errorMessage = (res as any).errorMessage || null; // Custom error property, if applicable

            const auditData: any = {
                id: uuidv4(),
                method,
                request_time: requestTime,
                status_code: statusCode,
                url,
                request_payload: JSON.stringify(body),
                headers: JSON.stringify(headers),
                ip_address: ip,
                response_time: responseTime,
                response_payload: JSON.stringify(responsePayload),
                service_name: resourceType,
                user_id: userId,
                error_message: errorMessage,
            };

            try {

                // Insert the data into the microservice_audits table using Drizzle ORM
                await db.insert(audits).values(auditData)

            } catch (error) {
                console.error('Error inserting audit log:', error);
            }

            // Proceed with the original response
            return originalEnd.call(res, chunk, encoding);
        };

        next();
    };
};

export default auditMiddleware;
