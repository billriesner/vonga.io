import { getProductsByCollection } from '@/lib/shopify';
import { Section } from '@/components/Section';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface CollectionPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;
  const { collection, products } = await getProductsByCollection(handle);

  if (!collection) {
    return (
      <Section className="py-5xl">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-navy mb-lg">Collection Not Found</h1>
          <p className="text-lg text-black">The collection you're looking for doesn't exist.</p>
          <Link href="/shop" className="inline-block mt-xl bg-navy text-white px-2xl py-lg rounded font-semibold hover:opacity-90 transition-opacity">
            Back to Shop
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center py-5xl text-white flex items-center justify-center"
        style={{
          backgroundImage: 'url(/images/heroes/hero-placeholder.jpg)',
          backgroundColor: '#303E55',
          minHeight: '400px',
        }}
      >
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-md w-full">
          {/* Collection Title & Description */}
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-lg" style={{ color: '#33BECC', textShadow: '0 2px 8px rgba(255,255,255,0.9)', marginBottom: '48px' }}>
              {collection.title}
            </h1>
            {collection.description && (
              <p className="text-xl md:text-2xl font-semibold text-black leading-relaxed max-w-3xl mx-auto" style={{ textShadow: '0 1px 4px rgba(255,255,255,0.8)' }}>
                {collection.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <Section className="py-5xl" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-6xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-5xl">
              <p className="text-xl text-black">No products found in this collection.</p>
              <Link href="/shop" className="inline-block mt-xl bg-navy text-white px-2xl py-lg rounded font-semibold hover:opacity-90 transition-opacity">
                Back to Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(({ node: product }: any) => {
                const image = product.images.edges[0]?.node;
                const price = parseFloat(product.priceRange.minVariantPrice.amount);
                const collectionName = product.collections.edges[0]?.node.title || '';
                const isConcept = collectionName.toLowerCase().includes('concept');

                return (
                  <Link href={`/shop/products/products/${product.handle}`} key={product.id}>
                    <Card className="border-2 border-muted bg-white hover:border-accent transition-all hover:shadow-xl cursor-pointer h-full">
                      <CardContent className="p-md">
                        <div className="relative w-full aspect-square mb-md overflow-hidden rounded bg-muted">
                          {image ? (
                            <Image
                              src={image.url}
                              alt={image.altText || product.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <span className="text-text/40">No Image</span>
                            </div>
                          )}
                          {isConcept && (
                            <div className="absolute top-2 right-2">
                              <Badge variant="default" className="bg-accent text-navy font-semibold">
                                Pre-Order Now
                              </Badge>
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-navy mb-sm line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-2xl font-bold text-navy mb-md">
                          ${price.toFixed(2)}
                        </p>
                        <p className="font-semibold hover:underline" style={{ color: '#33BECC' }}>
                          View Details →
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
