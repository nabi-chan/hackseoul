import { supabase } from '@/utils/supabase/client'
import { Rating } from '@/components/rating'
import { Card } from '@/components/card'

export default async function Reviews({ query }: { query: string }) {
  const products = await supabase
    .from('products')
    .select('id')
    .eq('query', query)
    .throwOnError()
    .then((response) => response.data ?? [])
    .then((products) => products.map((product) => product.id as string))

  const reviews = await Promise.all(
    Array.from({ length: Math.round(products.length / 25) }, (_, index) =>
      supabase
        .from('reviews')
        .select('*')
        .in('product_id', products.slice(index * 25, (index + 1) * 25))
        .throwOnError()
        .then((response) => response.data ?? [])
    )
  ).then((responses) => responses.flat())

  return (
    <div className="p-4 flex flex-col gap-4">
      {reviews.map((review) => (
        <Card
          key={review.id}
          href={`/review/${review.id}`}
          image={review.images[0]}
        >
          <div className="flex flex-col">
            <span className="block truncate text-xs text-slate-600">
              {review.product_name}
            </span>
            <h1 className="font-bold truncate">{review.title}</h1>
            <p className="line-clamp-3">{review.content}</p>
          </div>
          <Rating score={review.rating} />
        </Card>
      ))}
    </div>
  )
}
