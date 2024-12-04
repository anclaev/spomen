import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Prisma } from '@prisma/client'
import { Response } from 'express'

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientUnknownRequestError
)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  override catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost
  ) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT
        response.status(status).json({
          statusCode: status,
          status: 'CONFLICT',
        })
        break
      }
      case 'P2000': {
        const status = HttpStatus.BAD_REQUEST
        response.status(status).json({
          statusCode: status,
          status: 'BAD REQUEST',
        })
        break
      }
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND
        response.status(status).json({
          statusCode: status,
          status: 'NOT FOUND',
        })
        break
      }
      default: {
        const status = HttpStatus.INTERNAL_SERVER_ERROR
        response.status(status).json({
          statusCode: status,
          status: 'NOT FOUND',
        })
        break
      }
    }
  }
}
