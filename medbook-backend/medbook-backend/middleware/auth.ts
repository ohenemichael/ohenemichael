import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateRequest, TokenPayload } from '@/lib/auth';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: TokenPayload;
}

export type AuthenticatedHandler = (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => Promise<void> | void;

export function withAuth(handler: AuthenticatedHandler) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const user = await authenticateRequest(req);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized. Please login.',
        });
      }

      req.user = user;
      return handler(req, res);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({
        success: false,
        message: 'Authentication failed',
      });
    }
  };
}

export function withRole(roles: string[]) {
  return function (handler: AuthenticatedHandler) {
    return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden. Insufficient permissions.',
        });
      }

      return handler(req, res);
    });
  };
}

export const withAdmin = withRole(['ADMIN']);
export const withDoctor = withRole(['DOCTOR', 'ADMIN']);
export const withPatient = withRole(['PATIENT', 'DOCTOR', 'ADMIN']);
