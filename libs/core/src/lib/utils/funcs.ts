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
