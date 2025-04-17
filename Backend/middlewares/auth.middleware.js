import jwt from 'jsonwebtoken';

const authMiddleware = async (request, response, next) => {
  try {
    // 1️⃣ Get token from either cookies or Authorization header
    const token =
      request.cookies.token ||
      request.headers?.authorization?.split(" ")[1];
   
      

    if (!token) {
      return response.status(401).json({
        message: "Provide token",
        error: true,
        success: false,
      });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return response.status(401).json({
        message: "Unauthorized access",
        error: true,
        success: false,
      });
    }

    // 3️⃣ Attach userId to request
    request.userId = decoded._id;

    next(); // Continue to next middleware/controller

  } catch (error) {
    return response.status(500).json({
      message: "You need to login first",
      error: true,
      success: false,
    });
  }
};

export default authMiddleware;
