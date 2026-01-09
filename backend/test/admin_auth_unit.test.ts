import { adminAuthMiddleware } from '../src/middlewares/auth.middleware';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../src/config/config';
import { AppError } from '../src/utils/AppError';

// Mock config and jwt
jest.mock('../src/config/config', () => ({
    jwtSecret: 'test-secret'
}));

// Mock AppError
jest.mock('../src/utils/AppError', () => {
    return {
        AppError: class extends Error {
            statusCode: number;
            constructor(message: string, statusCode: number) {
                super(message);
                this.statusCode = statusCode;
            }
        }
    };
});

describe('adminAuthMiddleware Unit Test', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            cookies: {},
            headers: {}
        };
        mockRes = {};
        mockNext = jest.fn();
    });

    it('should prefer adminAccessToken over accessToken', () => {
        // Create tokens using the real jwt.sign for validity
        const userToken = jwt.sign({ _id: '123', role: 'user' }, 'test-secret');
        const adminToken = jwt.sign({ _id: '456', role: 'admin' }, 'test-secret');

        mockReq.cookies = {
            accessToken: userToken,
            adminAccessToken: adminToken
        };

        adminAuthMiddleware(mockReq as Request, mockRes as Response, mockNext);

        // If the bug exists, it picks accessTokens (user), sees role=user, and calls next(error)
        // If fixed, it picks adminAccessToken (admin), sees role=admin, and calls next()

        // We expect it to succeed (call next without args) if fixed.
        // But currently it fails, so let's assert what happens NOW (failure) to confirm the bug?
        // Actually, let's write the test for DESIRED behavior.

        expect(mockNext).toHaveBeenCalledWith(); // Called with no error
        expect(mockNext).not.toHaveBeenCalledWith(expect.any(Error));
        expect((mockReq as any).user.role).toBe('admin');
    });

    it('should fail if only user token is present', () => {
        const userToken = jwt.sign({ _id: '123', role: 'user' }, 'test-secret');
        mockReq.cookies = {
            accessToken: userToken
        };

        adminAuthMiddleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
});
