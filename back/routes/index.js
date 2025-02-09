const Router = require('express').Router
const userController = require('../controllers/user-controller')
const router = new Router()
const {body, check} = require ('express-validator')
const authMiddleware = require('../middlewares/authMiddleware')
const animalController = require ('../controllers/animal-controller')
const moderatorMiddleware = require('../middlewares/moderatorMiddleware')
const volunteerController = require('../controllers/volunteer-controller')
const newsController = require('../controllers/news-controller')
const feedbackController = require('../controllers/feedback-controller')


router.post('/registration', 
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration)
router.post('/login', userController.login)
router.get('/logout', userController.logout)
router.get('/refresh', userController.refresh)
router.get('/users', userController.getUsers)
router.get('/user/:username', userController.getUser)

router.put('/updateProfile/:userId', authMiddleware, userController.updateProfile)

router.get('/user/adoptions/:userId', authMiddleware, animalController.getUserAdoptions);
router.get('/animals', animalController.getAnimals);
router.get('/animals/filter', animalController.getAnimalsByFilters);
router.get('/animals/:id', animalController.getAnimalById);


router.post('/animals', authMiddleware, moderatorMiddleware, animalController.createAnimal);
router.put('/animals/:id', authMiddleware, moderatorMiddleware, animalController.updateAnimal);
router.delete('/animals/:id', authMiddleware, moderatorMiddleware, animalController.deleteAnimal);


router.post('/animals/:id/adopt', authMiddleware, animalController.adoptAnimal);

router.post('/volunteers', authMiddleware, volunteerController.registerVolunteer);
router.put('/volunteers/:id/status', moderatorMiddleware, volunteerController.updateVolunteerStatus);
router.delete('/volunteers/:id', moderatorMiddleware, volunteerController.deleteVolunteer);

router.get('/news', newsController.getNews);
router.post('/news', moderatorMiddleware, newsController.createNews);
router.put('/news/:id', moderatorMiddleware, newsController.updateNews);
router.delete('/news/:id', moderatorMiddleware, newsController.deleteNews);

router.post('/feedback', feedbackController.createFeedback);
router.get('/feedback',moderatorMiddleware, feedbackController.getFeedback);

router.get('/user/adoptions/stats/:userId', authMiddleware, animalController.getUserAdoptionStats);

module.exports = router