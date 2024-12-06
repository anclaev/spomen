import { SafeParseError, SafeParseSuccess } from 'zod'
import { RpcException } from '@nestjs/microservices'
import * as grpc from '@grpc/grpc-js'
import { v4 } from 'uuid'

import { IMessage } from '../interfaces'

export function mergeObject(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>
): Record<string, unknown> {
  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (typeof obj2[key] === 'object') {
        mergeObject(
          obj1[key] as unknown as Record<string, unknown>,
          obj2[key] as unknown as Record<string, unknown>
        )
      } else {
        obj1[key] = obj2[key]
      }
    }
  }
  return obj1
}

export function expandObject(
  obj: Record<string, Record<string, unknown>>
): Record<string, unknown> {
  const resObj: Record<string, unknown> = {}

  Object.keys(obj).forEach((key) =>
    obj[key]
      ? typeof obj[key] == 'number'
        ? Object.keys(obj[key]).forEach((prop) =>
            obj[key][prop] ? (resObj[prop] = obj[key][prop]) : null
          )
        : (resObj[key] = obj[key])
      : null
  )

  return resObj
}

export function expectGrpcValidationError(
  val: SafeParseSuccess<unknown> | SafeParseError<unknown>
): void {
  if (val.error) {
    throw new RpcException({
      code: grpc.status.INVALID_ARGUMENT,
      message: val.error.errors.map((err) => err.message).join('\n'),
    })
  }
}

/**
 * Форматирование имени
 * @description Обрезает строку и делает каждое слово с заглавной буквы
 * @param name
 */
export const formatName = (name: string): string =>
  name
    .trim()
    .replace(/\n/g, ' ')
    .replace(/\s\s+/g, ' ')
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (l) => l.toUpperCase()))

/**
 * Создание сообщения
 * @description Генерирует сообщение с уникальным идентификатором
 * @param message
 */
export const createMessage = (message: string): IMessage => ({
  id: v4(),
  message,
})
