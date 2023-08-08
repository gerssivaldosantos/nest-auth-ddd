import { clearAllEntites } from '@core/@shared/domain/tests/helper'

const clearEntitiesAfterTests = async () => {
  await clearAllEntites()
}

export default clearEntitiesAfterTests
