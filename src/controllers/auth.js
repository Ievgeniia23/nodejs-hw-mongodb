import * as authServices from "../services/auth.js";

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session.id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const registerController = async (req, res) => {
    const user = await authServices.register(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered user',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
};

export const loginController = async (req, res) => {
    const session = await authServices.login(req.body);
    
  setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken: session.accessToken,
      },
    });
};

 export const refreshTokenController = async (req, res) => {
   const { refreshToken, sessionId } = req.cookies;
   const session = await authServices.refreshToken({ refreshToken, sessionId });

   setupSession(res, session);

   res.json({
     status: 200,
     message: 'Successfully refresh session',
     data: {
       accessToken: session.accessToken,
     },
   });
 };

 export const logoutController = async (req, res) => {
   if (req.cookies.sessionId) {
     await authServices.logout(req.cookies.sessionId);
   }

   res.clearCookie('refreshToken');
   res.clearCookie('sessionId');

   res.status(204).send();
 };
  

 
// {
// "name": "Ievgeniia",
// "email": "ievgeniia@gmail.com",
// "password":"123456"
// }

// V8KzQww5I46TOo2wVyuNknQXBKC02NZqvxKFU4Rs;
// 6787e57cf1af0e60147af766
