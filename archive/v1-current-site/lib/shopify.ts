const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

async function ShopifyData(query: string) {
  const URL = `https://${domain}/api/2024-01/graphql.json`;

  const options = {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };

  try {
    const response = await fetch(URL, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API Error:', response.status, errorText);
      throw new Error(`Shopify API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.errors) {
      console.error('Shopify GraphQL Errors:', data.errors);
      throw new Error('Shopify GraphQL Error');
    }

    return data;
  } catch (error) {
    console.error("Error fetching from Shopify:", error);
    throw error;
  }
}

export async function getProductsInCollection() {
  const query = `
    {
      products(first: 25) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await ShopifyData(query);

  const allProducts = response.data.products.edges
    ? response.data.products.edges
    : [];

  return allProducts;
}

export async function getAllProducts() {
  const query = `
    {
      products(first: 25) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            collections(first: 1) {
              edges {
                node {
                  title
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await ShopifyData(query);

    const allProducts = response?.data?.products?.edges || [];

    return allProducts;
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    return [];
  }
}

export async function getProductsByCollection(collectionHandle: string) {
  const query = `
    {
      collection(handle: "${collectionHandle}") {
        title
        description
        products(first: 25) {
          edges {
            node {
              id
              title
              handle
              description
              productType
              collections(first: 1) {
                edges {
                  node {
                    title
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await ShopifyData(query);

    const collection = response?.data?.collection || null;
    const products = collection?.products?.edges || [];

    return { collection, products };
  } catch (error) {
    console.error('Error in getProductsByCollection:', error);
    return { collection: null, products: [] };
  }
}

export async function getProduct(handle: string) {
  const query = `
    {
      product(handle: "${handle}") {
        id
        title
        handle
        description
        descriptionHtml
        collections(first: 5) {
          edges {
            node {
              title
              handle
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 25) {
          edges {
            node {
              id
              title
              priceV2 {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    }
  `;

  const response = await ShopifyData(query);

  const product = response.data.product ? response.data.product : null;

  return product;
}

export async function createCheckout(variantId: string, quantity: number) {
  const query = `
    mutation {
      checkoutCreate(input: {
        lineItems: [{ variantId: "${variantId}", quantity: ${quantity} }]
      }) {
        checkout {
          id
          webUrl
          lineItems(first: 5) {
            edges {
              node {
                title
                quantity
              }
            }
          }
        }
      }
    }
  `;

  const response = await ShopifyData(query);

  const checkout = response.data.checkoutCreate.checkout
    ? response.data.checkoutCreate.checkout
    : null;

  return checkout;
}

export async function updateCheckout(checkoutId: string, lineItems: any) {
  const lineItemsObject = lineItems.map((item: any) => {
    return `{
      variantId: "${item.variantId}",
      quantity: ${item.quantity}
    }`;
  });

  const query = `
    mutation {
      checkoutLineItemsReplace(checkoutId: "${checkoutId}", lineItems: [${lineItemsObject}]) {
        checkout {
          id
          webUrl
          lineItems(first: 25) {
            edges {
              node {
                id
                title
                quantity
              }
            }
          }
        }
      }
    }
  `;

  const response = await ShopifyData(query);

  const checkout = response.data.checkoutLineItemsReplace.checkout
    ? response.data.checkoutLineItemsReplace.checkout
    : null;

  return checkout;
}

