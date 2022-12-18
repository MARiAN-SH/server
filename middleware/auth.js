import jwt from 'jsonwebtoken';

// wants to like a post
// click the like button > auth middleware (next) > like cotroller....

const authMiddleware = async (req, res, next) => {
  // console.log(req.headers.authorization);
  try {
    const token = req.headers.authorization.split(' ')[1];
    const isCustomAuth = token.length < 500; //Checks the length of the token if >500  Google token true

    let decodedData;

    if (token && isCustomAuth) {
      // console.log('isCustomAuth');
      decodedData = jwt.verify(token, 'test');

      req.userId = decodedData?.id;
    } else {
      // google token
      // console.log('google token');
      decodedData = jwt.decode(token, 'test');
      req.userId = decodedData?.sub;
    }

    next();
  } catch (error) {}
};

export default authMiddleware;
