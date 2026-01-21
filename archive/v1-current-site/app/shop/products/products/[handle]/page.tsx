'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft, Check, Truck, Shield, RefreshCw } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [handle, setHandle] = useState<string>('');

  useEffect(() => {
    async function init() {
      const resolvedParams = await params;
      setHandle(resolvedParams.handle);
    }
    init();
  }, [params]);

  useEffect(() => {
    if (!handle) return;
    
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/shopify/product?handle=${handle}`);
        const data = await res.json();
        setProduct(data);
        
        console.log('Product collections:', data?.collections?.edges?.map((e: any) => e.node.title));
        
        if (data?.variants?.edges?.length > 0) {
          const firstVariant = data.variants.edges[0].node;
          setSelectedVariant(firstVariant);
          
          // Parse first variant to set initial size and color
          const title = firstVariant.title;
          const parts = title.split(' / ');
          if (parts.length >= 2) {
            setSelectedSize(parts[0]);
            setSelectedColor(parts[1]);
          } else if (parts.length === 1) {
            setSelectedSize(parts[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [handle]);

  // Update selected variant when size or color changes
  useEffect(() => {
    if (!product || !selectedSize) return;

    const targetTitle = selectedColor 
      ? `${selectedSize} / ${selectedColor}`
      : selectedSize;

    const matchingVariant = product.variants.edges.find((item: any) => {
      return item.node.title === targetTitle;
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node);
    }
  }, [selectedSize, selectedColor, product]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    try {
      const res = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          quantity: quantity,
        }),
      });

      const data = await res.json();
      
      if (data.webUrl) {
        // Redirect to Shopify checkout
        window.location.href = data.webUrl;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-navy mb-2">Product Not Found</h1>
        <p className="text-black/70 mb-6">The product you're looking for doesn't exist.</p>
        <Link href="/shop">
          <Button className="bg-gray-200 hover:bg-gray-300 text-black">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const images = product.images?.edges || [];
  const currentImage = images[selectedImage]?.node;
  const price = selectedVariant ? parseFloat(selectedVariant.priceV2.amount) : 0;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: selectedVariant?.priceV2.currencyCode || 'USD',
  }).format(price);

  // Check if product is in Concept collection
  const isConcept = product.collections?.edges?.some((item: any) => {
    const title = item.node.title.toLowerCase();
    const handle = item.node.handle.toLowerCase();
    return title.includes('concept') || handle.includes('concept');
  }) || false;

  console.log('Is Concept product?', isConcept, 'Collections:', product.collections?.edges?.map((e: any) => e.node.title));

  return (
    <div>
      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
              {currentImage ? (
                <Image
                  src={currentImage.url}
                  alt={currentImage.altText || product.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-24 h-24 text-gray-300" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((item: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImage
                        ? 'border-accent shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={item.node.url}
                        alt={item.node.altText || `${product.title} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 20vw, 10vw"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-black">
                {formattedPrice}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: isConcept ? '#303E55' : '#33BECC' }}>
                <Check className="w-4 h-4 mr-1" />
                {isConcept ? 'Pre-Order Now' : 'In Stock'}
              </span>
            </div>

            <div 
              className="max-w-none mb-8"
              style={{ color: '#000000' }}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                style={{
                  fontSize: '1rem',
                  lineHeight: '1.6'
                }}
                className="[&>p]:mb-6 [&>ul]:mb-6 [&>ol]:mb-6"
              />
            </div>

            {/* Size & Color Selection */}
            {product.variants.edges.length > 1 && (() => {
              // Extract unique sizes and colors
              const sizes = new Set<string>();
              const colors = new Set<string>();
              
              product.variants.edges.forEach((item: any) => {
                const parts = item.node.title.split(' / ');
                if (parts.length >= 1) sizes.add(parts[0]);
                if (parts.length >= 2) colors.add(parts[1]);
              });

              const uniqueSizes = Array.from(sizes);
              const uniqueColors = Array.from(colors);

              return (
                <>
                  {/* Size Selector */}
                  {uniqueSizes.length > 1 && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-navy mb-3">
                        Size
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {uniqueSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all ${
                              selectedSize === size
                                ? 'text-white shadow-md'
                                : 'border-gray-300 hover:border-accent text-navy'
                            }`}
                            style={selectedSize === size ? { backgroundColor: '#33BECC', borderColor: '#33BECC' } : {}}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Selector */}
                  {uniqueColors.length > 1 && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-navy mb-3">
                        Color
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {uniqueColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all ${
                              selectedColor === color
                                ? 'text-white shadow-md'
                                : 'border-gray-300 hover:border-accent text-navy'
                            }`}
                            style={selectedColor === color ? { backgroundColor: '#303E55', borderColor: '#303E55' } : {}}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-navy mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-accent font-bold"
                >
                  -
                </button>
                <span className="text-xl font-bold text-navy w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-accent font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale}
                className="flex-1 text-white py-6 text-lg font-bold shadow-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#33BECC' }}
                size="lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="border-t-2 border-gray-200 pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#33BECC' }}>
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-navy">30-Day Returns</h3>
                  <p className="text-sm font-semibold" style={{ color: '#33BECC' }}>Hassle-free returns and exchanges</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#303E55' }}>
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-navy">Secure Checkout</h3>
                  <p className="text-sm font-semibold" style={{ color: '#33BECC' }}>SSL encrypted transactions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#33BECC' }}>
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-navy">{isConcept ? 'Pre-Order Shipping' : 'Fast Shipping'}</h3>
                  <p className="text-sm font-semibold" style={{ color: '#33BECC' }}>
                    {isConcept ? 'Ships within 90 days of campaign being funded' : 'Ships within 2-3 business days'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Shop */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/shop">
            <Button className="bg-gray-200 hover:bg-gray-300 text-black">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
