import {useQuery} from 'react-query'
import {getItem} from '../hooks/api'

// useQuery is similar to our custom useAxios: takes a url, returns an object of data, status & error
// the key arg is a unique identifier for the query / data in cache; string, array or object
// the 2nd arg an async function that returns the data
// const { data, status, error } = useQuery(key, () => fetch(url))
// Whenever any component subsequently calls useQuery with the key,
// React Query will return the previously fetched  data from its cache
// and then fetch the latest data in the background (very similar to PWAs and service workers)

/**
 * Helper for GET to `/heroes` route
 * @returns {object} {data, status, error}
 */
export function useGetHeroes() {
  return useQuery('heroes', () => getItem('heroes'))
}