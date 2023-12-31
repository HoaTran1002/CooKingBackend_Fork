import { NextFunction, Request, Response } from 'express'
import { ICourse, IImage, IParams, IRoadmap, IVideo } from '~/interfaces/course.interface'
import { IResonseObject } from '~/interfaces/response.interface'
import Courses from '~/models/course.models'
import { Error } from 'mongoose'
import { findById } from '~/services/course.service'
import { uploadImageVPS } from '~/services/uploadToVps.service'
import { addImageToCourse } from '~/repositories/course.repository'

//create
export const courseCreate = async (
  req: Request<unknown, unknown, ICourse>,
  res: Response
): Promise<Response<IResonseObject> | void | IResonseObject> => {
  try {
    const course = await Courses.create(req.body)
    const response: IResonseObject = {
      message: 'create sucess!',
      status: 200,
      data: course
    }
    if (!course) {
      response.message = 'create failed!!'
      response.status = 400
    }

    return res.status(response.status ? response.status : 400).json(response)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const courseCreateRoadmap = async (
  req: Request<any, unknown, IRoadmap>,
  res: Response
): Promise<Response<IResonseObject> | void> => {
  const response: IResonseObject = {
    message: ''
  }
  const params: IParams = req.params
  const roadmap: IRoadmap = req.body
  const fillter = { _id: params.courseId }
  const update = { $push: { roadmaps: roadmap } }
  const options = { new: true }
  const course = await Courses.findOneAndUpdate<ICourse>(fillter, update, options)
  if (!course) {
    return res.status(404).send('Course not found')
  }
  if (course) {
    response.message = 'created roadmap'
    response.data = course
    response.status = 201
  }
  return res.status(201).json({ course: course })
}

export const getCourseById = async (req: Request, res: Response): Promise<Response<IResonseObject> | void> => {
  const idCourse = req.params.idCourse
  const response: IResonseObject = {
    message: 'get course success!'
  }
  if (idCourse) {
    const course = await findById(idCourse)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }
    response.data = course
    return res.status(200).json(response)
  } else {
    return res.status(404).json({ message: 'Not Found' })
  }
}
//update
export const courseUpdateById = async (
  req: Request<any, unknown, ICourse>,
  res: Response
): Promise<Response<IResonseObject> | void> => {
  try {
    const params = req.params
    const fillter = { _id: params?.courseId }
    const upadate: ICourse = req.body
    const options = { new: true }
    const response: IResonseObject = {
      message: ''
    }
    if (!params.courseId) {
      response.message = 'not exist courseId'
      response.status = 401
      return res.status(401).json(response)
    }
    const course = await Courses.findOneAndUpdate(fillter, upadate, options)
    if (!course) {
      return res.status(404).send('Course not found')
    }
    if (course) {
      response.message = 'updated course success'
      response.status = 200
      response.data = course
      return res.status(200).json(course)
    }
  } catch (error: any) {
    throw new Error(error)
  }
}

export const updateRoadmapById = async (
  req: Request<any, unknown, IRoadmap>,
  res: Response
): Promise<Response<IResonseObject> | void> => {
  try {
    const params = req.params
    const fillter = { _id: params.courseId, 'roadmaps._id': params.roadmapId }
    const roadmap: IRoadmap = req.body
    const update = {
      $set: {
        'roadmaps.$.name': roadmap.name,
        'roadmaps.$.startTime': roadmap.startTime,
        'roadmaps.$.endTime': roadmap.endTime,
        'roadmaps.$.knowledge': roadmap.knowledge,
        'roadmaps.$.skill': roadmap.skill
      }
    }
    const options = { new: true }
    const response: IResonseObject = {
      message: ''
    }
    const course = await Courses.findOneAndUpdate(fillter, update, options)
    if (!course) {
      return res.status(404).send('Course or roadmap not found')
    }
    if (course) {
      response.message = 'updated roadmap success'
      response.status = 200
      response.data = course
      return res.status(200).json(response)
    }
  } catch (error: any) {
    throw new Error(error)
  }
}

//remove
export const removeRoadmapById = async (
  req: Request<any, unknown, unknown>,
  res: Response
): Promise<Response<IResonseObject> | void> => {
  try {
    const response: IResonseObject = {
      message: ''
    }
    const params = req.params
    const filter = { _id: params.courseId }
    const update = {
      $pull: {
        roadmaps: { _id: params.roadmapId }
      }
    }

    const options = { new: true }
    const updatedCourse = await Courses.findOneAndUpdate(filter, update, options)
    if (!updatedCourse) {
      return res.status(404).send('Course or roadmap not found')
    } else {
      response.message = 'deleted roadmap success'
      response.status = 204
      response.data = updatedCourse
      return res.status(204).json(response)
    }
  } catch (error: any) {
    throw new Error(error)
  }
}
export const removeRoadmaps = async (
  req: Request<any, unknown, unknown>,
  res: Response
): Promise<Response<IResonseObject> | void> => {
  try {
    const response: IResonseObject = {
      message: ''
    }
    const params = req.params
    const filter = { _id: params.courseId }
    const update = {
      $pull: {
        roadmaps: { _id: params.roadmapId }
      }
    }

    const options = { new: true }
    const updatedCourse = await Courses.findOneAndUpdate(filter, update, options)
    if (!updatedCourse) {
      return res.status(404).send('Course or roadmap not found')
    } else {
      response.message = 'deleted roadmap success'
      response.status = 204
      response.data = updatedCourse
      return res.status(204).json(response)
    }
  } catch (error: any) {
    throw new Error(error)
  }
}
export const removeCourseById = async (
  req: Request<any, unknown, unknown>,
  res: Response
): Promise<Response<IResonseObject> | void> => {
  try {
    const response: IResonseObject = {
      message: ''
    }
    const params = req.params
    const filter = { _id: params.courseId }

    const udeletedCourse = await Courses.findByIdAndDelete(filter)
    if (!udeletedCourse) {
      return res.status(404).send('Course  not found')
    } else {
      response.message = 'deleted Course success'
      response.status = 204
      response.data = udeletedCourse
      return res.status(204).send('ok')
    }
  } catch (error: any) {
    throw new Error(error)
  }
}

//queries
export const getAll = async (
  req: Request<unknown, unknown, ICourse>,
  res: Response
): Promise<Response<IResonseObject> | void> => {
  try {
    const course = await Courses.find({})
    const response: IResonseObject = {
      message: 'get all sucess!',
      status: 200,
      data: course
    }
    return res.status(200).json(course)
  } catch (error) {
    console.log(error)
  }
}
export const findOneById = async (req: Request, res: Response): Promise<void | IResonseObject> => {}

//file
export const uploadImageFromLocalToS3ByCourseId = async (
  req: Request,
  res: Response
): Promise<Response<IResonseObject> | void> => {
  const idCourse = req.params.idCourse

  if (!idCourse) {
    return res.status(404).send('not found id course')
  }
  const course = await findById(idCourse)

  if (!course) {
    return res.status(404).json({ mesage: 'not found coures' })
  }
  const file = req.file
  if (!file) {
    return res.status(400).send('Không có file được tải lên.')
  }
  const imageObject: IImage = await uploadImageVPS(file) 
  if (!imageObject) {
    return res.status(500).json({ message: 'upload image failed', imageObject: imageObject })
  }
  const Images = await addImageToCourse(idCourse, imageObject)
  if (!Images) {
    return res.status(500).json({ message: 'upload image failed' })
  }

  return res.status(200).json({ message: 'upload image success', result: Images })
}
