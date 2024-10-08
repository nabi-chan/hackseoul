import Link from 'next/link'
import Image from 'next/image'
import createTranslation from 'next-translate/createTranslation'
import { Rating } from '@/components/rating'
import { readProducts } from '@/db/products'

export default async function Products({
  query,
  brand = '',
}: {
  query: string
  brand: string
}) {
  const { t } = createTranslation('common')

  const { brands, products } = await readProducts(query, brand)

  return (
    <>
      <nav className="flex flex-nowrap gap-2 p-4 overflow-auto">
        {brands.map((brand) => (
          <a
            key={brand.label}
            href={`/${query}?tab=${t('tab.products')}&brand=${brand.id}`}
            className="p-2 border-2 border-slate-200 rounded-xl text-nowrap"
          >
            {brand.label}
          </a>
        ))}
      </nav>
      <div className="p-4 flex flex-col gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="grid grid-cols-[100px,1fr] gap-4 border-2 border-slate-200 p-2 rounded-xl"
          >
            <Image
              width={300}
              height={300}
              className="object-cover aspect-square w-full rounded-lg"
              src={product.images[0]}
              alt=""
            />
            <div className="w-full flex flex-col justify-center overflow-hidden gap-2">
              <h1 className="font-bold truncate">{product.title}</h1>
              <p>
                {Number(product.price).toLocaleString('ko')}
                {t('product.price.suffix')}
              </p>
              <Rating score={product.rating} />
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
