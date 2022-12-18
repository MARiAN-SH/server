import express from 'express';

import {
  signin,
  signup,
  // updateDataUser,
  // logOutUser,
} from '../controllers/user.js'

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
// router.patch('/:id', updateDataUser);
// router.delete('/:id', logOutUser);

export default router;
