import { useState } from 'react'
import { apiDataSource } from '../../../../core/data/dataSources/apiDataSource'
import {
  IBikeDataSource,
  bikeDataSource,
} from '../../data/dataSources/bikeDataSource'
import { EBikeModel } from '../entities/ebikeModel'
import { IUseDomainHook } from '../../../../core/domain/interfaces'
import { getSearchBikeModelsUseCase } from "../useCases/getSearchBikeModelsUseCase";
const BikeDataSourceInstance = bikeDataSource({
  apiDataSource: apiDataSource,
})

interface IUseSearchBikeModelMethods {
  searchBikeModel: () => Promise<void>
}

export const useSearchBikeModel:IUseDomainHook<EBikeModel[], IUseSearchBikeModelMethods>  = (
  dataSource: IBikeDataSource | undefined = BikeDataSourceInstance
) => {
  const [bikeModelList, setBikeModelList] = useState<EBikeModel[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const searchBikeModel = async () => {
    setLoading(true)
    const result = await getSearchBikeModelsUseCase({ dataSource })
    if (result.type === 'Error') {
      setErrorMessage(result.err.message);
      setLoading(false)
      return
    }
    
    setBikeModelList(result.data)
    setLoading(false)
  }

  return {
    data:bikeModelList,
    searchBikeModel,
    isLoading,
    errorMessage
  }
}
