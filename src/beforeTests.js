import { clearAllEntites } from '@core/@shared/domain/tests/helper'

const clearEntitiesBeforeTests = async () => {
  await clearAllEntites()
}

export default clearEntitiesBeforeTests
