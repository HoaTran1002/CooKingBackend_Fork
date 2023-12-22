import { Router } from 'express'
import { uploadMemory } from '~/config/multer.config'
// eslint-disable-next-line prettier/prettier
import {
  getAll,
  courseCreate,
  courseCreateRoadmap,
  courseUpdateById,
  updateRoadmapById,
  removeRoadmapById,
  removeCourseById
} from '~/controllers/course.controller'
import {
  uploadImageFromLocalToS3ByCourseId,
  updateContentImageS3,
  deleteImageFromS3ByCourseId,
  deleteAllImageFromS3ByCourseId,
  getAllImageFromS3ByCourseId,
  getImageFromS3BykeyImage,
  uploadVideoFromLocalToS3ByCourseId,
  deleteVideoFromS3ByCourseId,
  deleteAllVideoFromS3ByCourseId,
  getAllVideoFromS3ByCourseId,
  getVideoFromS3BykeyVideo
} from '~/controllers/uploadToS3.controllers'
import { ICourse, IRoadmap } from '~/interfaces/course.interface'
import { authorize } from '~/middlewares/auth.middlewears'
import { asyncHandelError } from '~/middlewares/error.middlewear'
import { validateBody } from '~/middlewares/validate.middlewear'
import { courseValidate, roadmapValidate } from '~/validator/course.validator'
const router = Router()

router.get('/getAll', asyncHandelError(getAll))
router.post('/create', validateBody<ICourse>(courseValidate), asyncHandelError(courseCreate))
router.get('/:courseId/roadmap/getAll', authorize(), asyncHandelError(courseCreateRoadmap))
router.post(
  '/:courseId/roadmap/create',
  authorize(),
  validateBody<IRoadmap>(roadmapValidate),
  asyncHandelError(courseCreateRoadmap)
)

router.put('/:courseId/update', authorize(), validateBody<ICourse>(courseValidate), asyncHandelError(courseUpdateById))
router.put(
  '/:courseId/roadmap/:roadmapId/update',
  authorize(),
  validateBody<IRoadmap>(roadmapValidate),
  asyncHandelError(updateRoadmapById)
)
router.delete('/:courseId/roadmap/:roadmapId/remove', authorize(), asyncHandelError(removeRoadmapById))
router.delete('/:courseId/remove', authorize(), asyncHandelError(removeCourseById))

//file
router.post(
  '/uploadImageFromLocal/:idCourse',
  uploadMemory.single('file'),
  asyncHandelError(uploadImageFromLocalToS3ByCourseId)
)
router.put('/:keyImage/updateContentImage', uploadMemory.single('file'), asyncHandelError(updateContentImageS3))
router.delete('/:keyImage/deleteImageFromByCourseId/:idCourse', asyncHandelError(deleteImageFromS3ByCourseId))
router.delete('/deleteAllImageFrom/:idCourse', asyncHandelError(deleteAllImageFromS3ByCourseId))
router.get('/getAllImageFrom/:idCourse', asyncHandelError(getAllImageFromS3ByCourseId))
router.get('/:keyImage/getImageFrom', asyncHandelError(getImageFromS3BykeyImage))

router.post(
  '/uploadVideoFromLocalS3/:idCourse',
  uploadMemory.single('file'),
  asyncHandelError(uploadVideoFromLocalToS3ByCourseId)
)
router.delete('/:keyVideo/deleteVideoFromS3ByCourseId/:idCourse', asyncHandelError(deleteVideoFromS3ByCourseId))
router.delete('/deleteAllVideoFromS3/:idCourse', asyncHandelError(deleteAllVideoFromS3ByCourseId))
router.get('/getAllVideoFromS3/:idCourse', asyncHandelError(getAllVideoFromS3ByCourseId))
router.get('/:keyVideo/getVideoFromS3', asyncHandelError(getVideoFromS3BykeyVideo))
export default router
