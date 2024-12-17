// express
import { NextFunction } from 'express';

// moment
import moment from 'moment';

// uuid
import { v4 as uuidv4 } from 'uuid';

// database configuration
import { db } from '@/db';

// schema
import { audits } from '@/db/schema';

// environment variables
import { env } from '@/variables';

// types
import { ExtendedRequest } from '@/types';

// Middleware to audit requests and responses
const auditMiddleware = (req: ExtendedRequest, res: any, next: NextFunction): void => {
  const serviceName: string = env.serviceName; // Service name from environment variables
  const requestTime = moment(); // Capture request start time

  // Save the original res.end function and type it properly
  const originalEnd = res.end.bind(res); // Bind res to maintain context

  // Override res.end
  res.end = async (chunk: any, encoding?: BufferEncoding) => {
    const endTime = moment(); // Capture response end time
    const responseTime = endTime.diff(requestTime, 'milliseconds'); // Calculate response time in ms

    // Extract request and response details
    const { method, url, headers, ip, body } = req;
    const userId = req.user?.sub || null; // Retrieve user ID from `req.user`
    const statusCode = res.statusCode;

    const responsePayload = chunk ? chunk.toString(encoding || 'utf8') : null; // Safely parse response payload
    const errorMessage = (res as any).errorMessage || null; // Capture custom error message

    // Construct the audit data object
    const auditData = {
      id: uuidv4(),
      service_name: serviceName,
      method,
      url,
      status_code: statusCode,
      request_time: requestTime.toISOString(),
      response_time: responseTime,
      ip_address: ip,
      user_id: userId,
      headers: JSON.stringify(headers),
      request_payload: JSON.stringify(body || {}),
      response_payload: responsePayload ? JSON.stringify(responsePayload) : null,
      error_message: errorMessage,
    };

    try {
      // Insert audit data into the database
      await db.insert(audits).values(auditData);
    } catch (error) {
      console.error('Error inserting audit log:', error);
    }

    // Call the original res.end with correct arguments
    return originalEnd(chunk, encoding);
  };

  next();
};

export default auditMiddleware;
