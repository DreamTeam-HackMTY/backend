import { string as helper } from '@ioc:Adonis/Core/Helpers'
import FormatDates from './FormatDates'
import { DateTime } from 'luxon'

type CodeGeneratorType = 'number' | 'string' | 'both'

class CodeGenerator {
  constructor() {
    return this
  }

  private generateRandomNumber(length: number) {
    let code = ''

    for (let i = 0; i < length; i++) {
      code += Math.floor(0 + Math.random() * 9).toString()
    }

    return code
  }

  public codeGenerator({
    type,
    length,
  }: {
    type: CodeGeneratorType
    length: number
  }) {
    const full_code = {
      number: this.generateRandomNumber,
      string: helper.generateRandom,
      both: (len: number) =>
        `${this.generateRandomNumber(len)}-${helper.generateRandom(len)}`,
    }

    const start = FormatDates.now()

    const due = start.plus({ days: 1 })

    return {
      code: full_code[type](length),
      start_date: FormatDates.serializeDates().serialize(start),
      due_date: FormatDates.serializeDates().serialize(due),
    }
  }

  public isCodeExpired({ due_date }: { due_date: DateTime }) {
    const now = FormatDates.now()

    return now >= due_date
  }
}

export default new CodeGenerator()
