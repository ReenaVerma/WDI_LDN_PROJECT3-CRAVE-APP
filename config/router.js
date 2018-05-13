const router = require('express').Router();
const auth = require('../controllers/auth');

router.post('/register', auth.register);
router.post('/login', auth.login);

router.get('/users/:id', auth.show);
router.put('/users/:id', auth.update);

router.route('/*')
  .all((req, res) => res.status(404).json({ message: 'Not found' }));


module.exports = router;
