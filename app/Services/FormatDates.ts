import { DateTime } from 'luxon'

const DATE_FORMATS = {
  FULL: 'yyyy-MM-dd HH:mm:ss',
  DATE: 'yyyy-MM-dd',
} as const

type DateFormat = (typeof DATE_FORMATS)[keyof typeof DATE_FORMATS]

class FormatDates {
  constructor() {
    return this
  }

  private localZone = 'America/Monterrey'
  private fullFormat: DateFormat = DATE_FORMATS.FULL
  private dateFormat: DateFormat = DATE_FORMATS.DATE

  public getLocalZone() {
    return this.localZone
  }

  public getFullFormat() {
    return this.fullFormat
  }

  public getDateFormat() {
    return this.dateFormat
  }

  public setZone({ zone }: { zone: string }) {
    this.localZone = zone
  }

  public now() {
    return DateTime.now().setZone(this.localZone)
  }

  public isValidDateTime({
    date,
    format,
  }: {
    date: string
    format: DateFormat
  }) {
    const { isValid, invalidReason } = DateTime.fromFormat(
      date,
      format,
    ).setZone(this.localZone)

    return {
      isValid,
      invalidReason,
    }
  }

  public stringToDateTime({
    onlyDate,
    onlyTime,
    fullDateTime,
    format,
  }: {
    onlyDate?: string | null
    onlyTime?: string | null
    fullDateTime?: string | null
    format?: DateFormat | null
  }) {
    format = format ?? this.fullFormat

    if (onlyDate && !onlyTime) {
      return DateTime.fromFormat(`${onlyDate} 00:00:00`, format).setZone(
        this.localZone,
      )
    }

    if (!onlyDate && onlyTime) {
      const now = DateTime.now()
        .setZone(this.localZone)
        .toFormat(this.dateFormat)

      return DateTime.fromFormat(`${now} ${onlyTime}`, format).setZone(
        this.localZone,
      )
    }

    if (onlyDate && onlyTime) {
      return DateTime.fromFormat(`${onlyDate} ${onlyTime}`, format).setZone(
        this.localZone,
      )
    }

    if (fullDateTime) {
      return DateTime.fromFormat(fullDateTime, format).setZone(this.localZone)
    }

    return DateTime.now().setZone(this.localZone)
  }

  public serializeDates(params?: { format?: DateFormat }) {
    return {
      serialize: (value: DateTime) =>
        value
          .setZone(this.localZone)
          .toFormat(params?.format ?? this.fullFormat),
    }
  }

  public convertToLocalZone(date: any) {
    const _date = DateTime.fromJSDate(date).setZone(this.localZone)
    return this.serializeDates({ format: this.fullFormat }).serialize(_date)
  }

  public convertDateTimeToDate({
    date,
    format,
  }: {
    date: string
    format: DateFormat
  }) {
    const _date = DateTime.fromFormat(date, format).setZone(this.localZone)
    return _date.toJSDate()
  }

  public validateDates({ start, end }: { start: string; end: string }) {
    const start_date = DateTime.fromFormat(start, this.dateFormat).setZone(
      this.localZone,
    )

    const end_date = DateTime.fromFormat(end, this.dateFormat).setZone(
      this.localZone,
    )

    if (!start_date.isValid || !end_date.isValid) {
      return {
        isValid: false,
        message: 'Las fechas no son válidas.',
        data: {
          start: start_date.invalidReason,
          end: end_date.invalidReason,
        },
      }
    }

    if (start_date > end_date) {
      return {
        isValid: false,
        message: 'La fecha de inicio no puede ser mayor a la fecha de fin.',
        data: {
          start: start_date.toFormat(this.dateFormat),
          end: end_date.toFormat(this.dateFormat),
        },
      }
    }

    return {
      isValid: true,
      message: null,
      data: null,
    }
  }
}

export default new FormatDates()
