'use client'

import { Button } from '@/components/ui/button'
import { PRODUCT_CATEGORIES } from '@/config'
import { useCart } from '@/hooks/use-cart'
import { cn, formatPrice } from '@/lib/utils'
import { trpc } from '@/trpc/client'
import { Check, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Page = () => {
  const { items, removeItem } = useCart()
  const router = useRouter()
  const { mutate: createCheckoutSession, isLoading } = trpc.payment.createSession.useMutation({
    onSuccess: ({ url }) => {
      if (url) router.push(url)
    },
  })

  const productIds = items.map(({ product }) => product.id)
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  })
  const [addressErrors, setAddressErrors] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  })
  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(true)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const cartTotal = items.reduce(
    (total, { product }) => total + product.price,
    0
  )
  
  const fee = 1

  const isValidPostalCode = (code) => {
    const postalCodeRegex = /(^\d{5}$)|(^\d{5}-\d{4}$)/; // Validates 5 digits or 5+4 format
    return postalCodeRegex.test(code);
  }

  useEffect(() => {
    const errors = {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    }

    if (!address.street) errors.street = 'Street is required.'
    if (!address.city) errors.city = 'City is required.'
    if (!address.state) errors.state = 'State is required.'
    if (!address.postalCode) {
      errors.postalCode = 'Postal Code is required.'
    } else if (!isValidPostalCode(address.postalCode)) {
      errors.postalCode = 'Invalid Postal Code format.'
    }
    if (!address.country) errors.country = 'Country is required.'

    setAddressErrors(errors)

    const isValid = Object.values(errors).every((error) => error === '')
    setIsCheckoutDisabled(items.length === 0 || !isValid)
  }, [address, items])

  return (
    <div className='bg-white'>
      <div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
          Shopping Cart
        </h1>

        <div className='mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16'>
          <div className={cn('lg:col-span-7', {
              'rounded-lg border-2 border-dashed border-zinc-200 p-12': isMounted && items.length === 0,
            })}>
            <h2 className='sr-only'>Items in your shopping cart</h2>

            {isMounted && items.length === 0 ? (
              <div className='flex h-full flex-col items-center justify-center space-y-1'>
                <div
                  aria-hidden='true'
                  className='relative mb-4 h-40 w-40 text-muted-foreground'>
                  <Image
                    src='/hippo-empty-cart.png'
                    fill
                    loading='eager'
                    alt='empty shopping cart hippo'
                  />
                </div>
                <h3 className='font-semibold text-2xl'>Your cart is empty</h3>
                <p className='text-muted-foreground text-center'>
                  Whoops! Nothing to show here yet.
                </p>
              </div>
            ) : null}

            <ul className={cn({
                'divide-y divide-gray-200 border-b border-t border-gray-200': isMounted && items.length > 0,
              })}>
              {isMounted && items.map(({ product }) => {
                const label = PRODUCT_CATEGORIES.find(
                  (c) => c.value === product.category
                )?.label

                const { image } = product.images[0]

                return (
                  <li key={product.id} className='flex py-6 sm:py-10'>
                    <div className='flex-shrink-0'>
                      <div className='relative h-24 w-24'>
                        {typeof image !== 'string' && image.url ? (
                          <Image
                            fill
                            src={image.url}
                            alt='product image'
                            className='h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48'
                          />
                        ) : null}
                      </div>
                    </div>

                    <div className='ml-4 flex flex-1 flex-col justify-between sm:ml-6'>
                      <div className='relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0'>
                        <div>
                          <div className='flex justify-between'>
                            <h3 className='text-sm'>
                              <Link
                                href={`/product/${product.id}`}
                                className='font-medium text-gray-700 hover:text-gray-800'>
                                {product.name}
                              </Link>
                            </h3>
                          </div>

                          <div className='mt-1 flex text-sm'>
                            <p className='text-muted-foreground'>Category: {label}</p>
                          </div>

                          <p className='mt-1 text-sm font-medium text-gray-900'>
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        <div className='mt-4 sm:mt-0 sm:pr-9 w-20'>
                          <div className='absolute right-0 top-0'>
                            <Button
                              aria-label='remove product'
                              onClick={() => removeItem(product.id)}
                              variant='ghost'>
                              <X className='h-5 w-5' aria-hidden='true' />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <p className='mt-4 flex space-x-2 text-sm text-gray-700'>
                        <Check className='h-5 w-5 flex-shrink-0 text-green-500' />
                        <span>Eligible for instant delivery</span>
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <section className='mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8'>
            <h2 className='text-lg font-medium text-gray-900'>Order summary</h2>

            <div className='mt-6 space-y-4'>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-600'>Subtotal</p>
                <p className='text-sm font-medium text-gray-900'>
                  {isMounted ? formatPrice(cartTotal) : <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />}
                </p>
              </div>

              <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                <div className='flex items-center text-sm text-muted-foreground'>
                  <span>Flat Transaction Fee</span>
                </div>
                <div className='text-sm font-medium text-gray-900'>
                  {isMounted ? formatPrice(fee) : <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />}
                </div>
              </div>

              <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                <div className='text-base font-medium text-gray-900'>Order Total</div>
                <div className='text-base font-medium text-gray-900'>
                  {isMounted ? formatPrice(cartTotal + fee) : <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />}
                </div>
              </div>
            </div>

            {/* Address Form */}
            <div className='mt-6'>
              <h3 className='text-lg font-medium text-gray-900'>Shipping Address</h3>
              <div className='mt-4'>
                <input
                  type='text'
                  placeholder='Street'
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className='w-full border border-gray-300 p-2 rounded-md'
                />
                {addressErrors.street && <p className='text-red-500'>{addressErrors.street}</p>}
                
                <input
                  type='text'
                  placeholder='City'
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className='w-full border border-gray-300 p-2 rounded-md mt-2'
                />
                {addressErrors.city && <p className='text-red-500'>{addressErrors.city}</p>}
                
                <input
                  type='text'
                  placeholder='State'
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className='w-full border border-gray-300 p-2 rounded-md mt-2'
                />
                {addressErrors.state && <p className='text-red-500'>{addressErrors.state}</p>}
                
                <input
                  type='text'
                  placeholder='Postal Code'
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  className='w-full border border-gray-300 p-2 rounded-md mt-2'
                />
                {addressErrors.postalCode && <p className='text-red-500'>{addressErrors.postalCode}</p>}
                
                <input
                  type='text'
                  placeholder='Country'
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className='w-full border border-gray-300 p-2 rounded-md mt-2'
                />
                {addressErrors.country && <p className='text-red-500'>{addressErrors.country}</p>}
              </div>
            </div>

            <div className='mt-6'>
              <Button
                disabled={isCheckoutDisabled || isLoading}
                onClick={() => createCheckoutSession({ productIds, address })} // Include address in the checkout session
                className='w-full'
                size='lg'>
                {isLoading ? <Loader2 className='w-4 h-4 animate-spin mr-1.5' /> : null}
                Checkout
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Page
