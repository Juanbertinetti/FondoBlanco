import jwt from 'jsonwebtoken';

const SECRET = "_AQPsssHV56kFO7ImQL9DPEj5UzCYuLGB8bSAmedv74gLPueV9abm51Ca18rIGJC";

export const verifyToken = async (token) => {
    console.log(token);
    if (!token) {
        return false;
    }

    try {
        const decoded = await jwt.verify(token, SECRET);
        console.log(decoded);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const decodeToken = async (token) => {
    if (!token) {
        return false;
    }

    const isValid = await verifyToken(token);
    if (!isValid) {
        return false;
    }

    const decoded = await jwt.verify(token, SECRET);
    return decoded;
};