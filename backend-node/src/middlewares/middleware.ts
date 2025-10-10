import jwt from "jsonwebtoken";

export const authMiddleware = (req: any, res: any, next: any) => {
    const token = req.cookies.access_token;
    req.session = { user: null};

    jwt.verify(token, process.env.JWT_SECRET ?? "", (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        req.session = { user: decoded};
        next();
    });
}