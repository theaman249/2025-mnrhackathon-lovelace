const verifyToken = require('../middleware/authMiddleware')
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('verifyToken middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    process.env.JWT_SECRET = 'testsecret';
  });

  it('should return 401 if no Authorization header', () => {
    req.header.mockReturnValue(null);

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access denied' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if Authorization header is malformed', () => {
    req.header.mockReturnValue('BadFormatToken');

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access denied' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    req.header.mockReturnValue('Bearer faketoken');
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next and attach userId if token is valid', () => {
    req.header.mockReturnValue('Bearer validtoken');
    jwt.verify.mockReturnValue({ userId: 123 });

    verifyToken(req, res, next);

    expect(req.userId).toBe(123);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
