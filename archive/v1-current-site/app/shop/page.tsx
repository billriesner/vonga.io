import { Section } from "@/components/Section";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/lib/shopify";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="relative min-h-[400px] flex items-center justify-center text-center"
        style={{
          backgroundImage: 'url(/images/heroes/hero-placeholder.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/60" />
        <div className="relative z-10 w-full px-lg max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-lg" style={{ color: '#303E55', textShadow: '0 2px 8px rgba(255,255,255,0.9)' }}>
              Shop Vonga
            </h1>
            <p className="text-xl md:text-2xl font-bold text-black" style={{ textShadow: '0 1px 4px rgba(255,255,255,0.8)' }}>
              On-body tech that unlocks rewards and access
            </p>
          </div>
        </div>
      </div>

      {/* Two Ways to Shop */}
      <Section className="py-5xl" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-3xl">
            Two Ways to Shop
          </h2>
          <p className="text-lg text-black text-center max-w-3xl mx-auto mb-5xl">
            Vonga gives you two ways to shop, whether you want to simply buy premium athleisure-wear or shape the direction of the brand.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ marginTop: '64px' }}>
            {/* Core Collection Card */}
            <Card className="border-2 border-muted bg-white hover:border-accent transition-all hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-lg shadow-lg" style={{ backgroundColor: '#33BECC' }}>
                  <ShoppingBag className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-md">Core Collection</h3>
                <p className="text-base text-black leading-relaxed" style={{ marginBottom: '48px' }}>
                  Shop our Core Collection of in stock premium athleisure-wear where we can have most items on your doorstep within days of your order.
                </p>
                <Link 
                  href="/shop/collections/core-collection"
                  className="inline-block bg-gray-200 hover:bg-gray-300 text-black px-3xl py-lg rounded font-semibold text-lg shadow-md transition-colors"
                >
                  Shop Core Collection
                </Link>
              </CardContent>
            </Card>

            {/* Concept Collection Card */}
            <Card className="border-2 border-muted bg-white hover:border-accent transition-all hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-lg shadow-lg" style={{ backgroundColor: '#303E55' }}>
                  <ShoppingBag className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-md">Concept Collection</h3>
                <p className="text-base text-black leading-relaxed" style={{ marginBottom: '48px' }}>
                  Decide what we make next and save. New design campaigns launched each month. Orders shipped within 90 days of funding. Discounts provided for those who help shape the Vonga brand.
                </p>
                <Link 
                  href="/shop/collections/concept-collection"
                  className="inline-block bg-gray-200 hover:bg-gray-300 text-black px-3xl py-lg rounded font-semibold text-lg shadow-md transition-colors"
                >
                  Shop Concept Collection
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Products Grid */}
      <Section className="py-5xl" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-5xl">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-lg shadow-lg" style={{ backgroundColor: '#33BECC' }}>
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-navy mb-md">Coming Soon</h2>
              <p className="text-lg font-semibold mb-xl" style={{ color: '#33BECC' }}>
                Our first collection launches soon. Join our mailing list to get notified.
              </p>
              <Link 
                href="/#stay-connected"
                className="inline-block bg-gray-200 hover:bg-gray-300 text-black px-xl py-md rounded font-semibold shadow-md transition-colors"
              >
                Get Early Access
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-5xl">
                All Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((item: any) => {
                  const product = item.node;
                  const image = product.images.edges[0]?.node;
                  const price = parseFloat(product.priceRange.minVariantPrice.amount);
                  const formattedPrice = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: product.priceRange.minVariantPrice.currencyCode,
                  }).format(price);

                  return (
                    <Link 
                      key={product.id} 
                      href={`/shop/products/products/${product.handle}`}
                      className="group"
                    >
                      <Card className="border-2 border-muted hover:border-accent transition-all hover:shadow-xl bg-white h-full flex flex-col">
                        <CardContent className="p-0">
                          <div className="relative aspect-square bg-gray-100 overflow-hidden rounded-t-lg">
                            {image ? (
                              <Image
                                src={image.url}
                                alt={image.altText || product.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="w-16 h-16 text-gray-300" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-bold text-lg text-navy mb-4 group-hover:text-accent transition-colors">
                            {product.title}
                          </h3>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-2xl font-bold text-black">
                              {formattedPrice}
                            </span>
                            <span className="text-sm font-semibold" style={{ color: '#33BECC' }}>
                              View Details →
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </Section>

      {/* Trust Signals */}
      <Section className="py-4xl" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-md shadow-lg" style={{ backgroundColor: '#303E55' }}>
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-navy mb-2">Secure Checkout</h3>
              <p className="text-sm font-semibold" style={{ color: '#33BECC' }}>SSL encrypted transactions</p>
            </div>
            <div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-md shadow-lg" style={{ backgroundColor: '#33BECC' }}>
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-navy mb-2">30-Day Returns</h3>
              <p className="text-sm font-semibold" style={{ color: '#33BECC' }}>Hassle-free returns</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
