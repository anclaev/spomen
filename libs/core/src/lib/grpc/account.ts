// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.5.0
//   protoc               v3.20.3
// source: account.proto

/* eslint-disable */
import { Metadata } from '@grpc/grpc-js'
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices'
import { Observable } from 'rxjs'

export const protobufPackage = 'account'

export interface CreateAccountPayload {
  login?: string | undefined
  email: string
  password: string
  firstName?: string | undefined
  lastName?: string | undefined
  birthday?: string | undefined
  sex?: number | undefined
}

export interface Status {
  status: boolean
}

export const ACCOUNT_PACKAGE_NAME = 'account'

export interface AccountServiceClient {
  createAccount(
    request: CreateAccountPayload,
    metadata?: Metadata
  ): Observable<Status>
}

export interface AccountServiceController {
  createAccount(
    request: CreateAccountPayload,
    metadata?: Metadata
  ): Promise<Status> | Observable<Status> | Status
}

export function AccountServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['createAccount']
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      )
      GrpcMethod('AccountService', method)(
        constructor.prototype[method],
        method,
        descriptor
      )
    }
    const grpcStreamMethods: string[] = []
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      )
      GrpcStreamMethod('AccountService', method)(
        constructor.prototype[method],
        method,
        descriptor
      )
    }
  }
}

export const ACCOUNT_SERVICE_NAME = 'AccountService'