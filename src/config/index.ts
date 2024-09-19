export const PRODUCT_CATEGORIES = [
  {
    label: 'Products',
    value: 'Products' as const,
    featured: [
      {
        name: 'Product #1',
        href: `/products?category=ui_kits`,
        imageSrc: '/nav/Products/Amatorus.png',
      },
      {
        name: 'Product #2',
        href: '/products?category=ui_kits&sort=desc',
        imageSrc: '/nav/Products/Amatorus.png',
      },
      {
        name: 'Product #3',
        href: '/products?category=ui_kits',
        imageSrc: '/nav/Products/Amatorus.png',
      },
    ],
  }
]
