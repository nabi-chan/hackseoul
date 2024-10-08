import { setTimeout } from 'timers/promises'
import { supabase } from '@/utils/supabase/client'
import { http } from '@/utils/http'
import { readProducts } from './products'

export async function readReviews(query: string, brand: string) {
  const { products } = await readProducts(query, brand)
  const productIds = products.map((product) => product.id)

  if (productIds.length === 0) {
    return {
      reviews: [],
    }
  }

  let reviews = await Promise.all(
    Array.from(
      { length: Math.max(Math.round(productIds.length / 25), 1) },
      (_, index) =>
        supabase
          .from('reviews')
          .select('*')
          .in('product_id', productIds.slice(index * 25, (index + 1) * 25))
          .throwOnError()
          .then((response) => response.data ?? [])
    )
  ).then((reviews) => reviews.flat())

  if (reviews.length < 10) {
    await Promise.all(
      productIds.map(async (productId) => {
        await setTimeout(1000)
        return http.get('/api/crawl/reviews', {
          productId,
          page: 1,
        })
      })
    )

    reviews = await Promise.all(
      Array.from(
        { length: Math.max(Math.round(productIds.length / 25), 1) },
        (_, index) =>
          supabase
            .from('reviews')
            .select('*')
            .in('product_id', productIds.slice(index * 25, (index + 1) * 25))
            .throwOnError()
            .then((response) => response.data ?? [])
      )
    ).then((reviews) => reviews.flat())
  }

  return { reviews }
}
