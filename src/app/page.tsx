import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import {
  Button,
  buttonVariants,
} from '@/components/ui/button'
import {
  Pill,
  Stethoscope,
  ShieldCheck,
} from 'lucide-react'
import Image from 'next/image';
import Pills from '../../public/nav/Products/Pills.png'

const perks = [
  {
    name: 'FDA Cleared',
    Icon: Pill,
    description:
      'All our products are FDA cleared. No Hassles.',
  },
  {
    name: '#1 Doctors recommended',
    Icon: Stethoscope,
    description:
      '9/10 Doctors Recommend Amatorus',
  },
  {
    name: 'ISO Standard',
    Icon: ShieldCheck,
    description:
      "All our procucts meet ISO standards",
  },
]

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>

      <div className='py-20 px-8 mx-auto flex items-center justify-start bg-purple-300 h-80' style={{ height: '500px', borderTopRightRadius: '170px', gap: '1rem' }}>
      {/* Text Section */}
      <div className='flex flex-col items-start w-2/3 px-4'>
      <p className='mt-6 text-lg max-w-prose'>
          Welcome to Amatorus.
        </p>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
          Your marketplace for high-quality{' '}
          <span className='text-purple-800'>
          Chemical disinfectants and antiseptics
          </span>
          .
        </h1>


      </div>


      <div className='w-1/4'>
      <Image src={Pills} alt={"Logo"} height="200" width="200" />
      </div>
    </div>

        <ProductReel
          query={{ sort: 'desc', limit: 4 }}
          href='/products?sort=recent'
          title='Our Products'
        />
      </MaxWidthWrapper>

      <section className='border-t border-gray-200 bg-gray-50'>
        <MaxWidthWrapper className='py-20'>
          <div className='grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0'>
            {perks.map((perk) => (
              <div
                key={perk.name}
                className='text-center md:flex md:items-start md:text-left lg:block lg:text-center'>
                <div className='md:flex-shrink-0 flex justify-center'>
                  <div className='h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900'>
                    {<perk.Icon className='w-1/3 h-1/3' />}
                  </div>
                </div>

                <div className='mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6'>
                  <h3 className='text-base font-medium text-gray-900'>
                    {perk.name}
                  </h3>
                  <p className='mt-3 text-sm text-muted-foreground'>
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  )
}
