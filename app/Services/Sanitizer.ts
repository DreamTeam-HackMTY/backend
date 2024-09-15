import { types, string as helper } from '@ioc:Adonis/Core/Helpers'

enum t {
  string,
  number,
  boolean,
}

type Type = keyof typeof t

class Sanitizer {
  constructor() {
    return this
  }

  public filter({
    data,
    props,
    removeNullAndUndefined = false,
    removeEmptyStrings = false,
    removeNull = false,
    removeUndefined = false,
    defaultValues = null,
  }: {
    data: any
    props?: string[]
    removeNullAndUndefined?: boolean
    removeNull?: boolean
    removeUndefined?: boolean
    removeEmptyStrings?: boolean
    defaultValues?: null | { [key: string]: any }
  }): any {
    const toFilter = (value: any) => {
      let entries = Object.entries(value)

      if (props) {
        entries = entries.filter(([key]) => props.includes(key))
      }

      if (removeEmptyStrings) {
        entries = entries.filter(([_, val]: any) => helper.isEmpty(val))
      }

      if (removeNullAndUndefined) {
        entries = entries.filter(
          ([_, val]) => !types.isNull(val) && !types.isUndefined(val),
        )
      }

      if (removeNull) {
        entries = entries.filter(([_, val]) => !types.isNull(val))
      }

      if (removeUndefined) {
        entries = entries.filter(([_, val]) => !types.isUndefined(val))
      }

      if (defaultValues) {
        entries = entries.map(([key, val]) => {
          if (types.isNull(val) || types.isUndefined(val)) {
            return [key, defaultValues[key]]
          }
          return [key, val]
        })
      }

      return Object.fromEntries(entries)
    }

    const applyDefaults = (value: any) => {
      return defaultValues ? { ...defaultValues, ...value } : value
    }

    return Array.isArray(data)
      ? data
          .filter((obj) => !types.isNull(obj) && !types.isUndefined(obj))
          .filter((obj) => types.isObject(obj))
          .map((obj) => applyDefaults(obj))
          .map((obj) => toFilter(obj))
          .filter((obj) => Object.keys(obj).length !== 0)
      : toFilter(applyDefaults(data))
  }

  public filterAndTypeQS({
    qs,
    schema,
  }: {
    qs: any
    schema: {
      [key: string]: Type
    }
  }) {
    const filtered = this.filter({
      data: qs,
      props: Object.keys(schema),
      removeNullAndUndefined: true,
    })

    for (const [key, type] of Object.entries(schema)) {
      if (!filtered[key]) {
        continue
      }

      if (type === 'number') {
        const value = Number(filtered[key])

        if (isNaN(value)) {
          return {
            isValid: false,
            msg: `el parametro '${key}' debe ser un número`,
            newQs: null,
          }
        }

        filtered[key] = value
      }

      if (type === 'boolean') {
        filtered[key] = Boolean(filtered[key])
      }
    }

    return {
      isValid: true,
      msg: null,
      newQs: filtered,
    }
  }
}

export default new Sanitizer()
