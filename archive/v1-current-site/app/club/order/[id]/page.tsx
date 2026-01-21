'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface ClubOrder {
  id: string;
  'Organization Name': string;
  'Contact Name': string;
  'Email': string;
  'Starter Kit': 'Core' | 'Pro';
  'Total Units': number;
  'Subtotal': number;
  'Deposit Amount': number;
  'Second Payment Amount': number;
  'Final Payment Amount': number;
  'Order Status': 'Deposit Paid' | 'Design Approved' | 'Production Ready' | 'Shipped';
  'Payment Status': 'Deposit Paid' | 'Second Payment Due' | 'Final Payment Due' | 'Fully Paid';
  'Created At': string;
  'Cart Items': string; // JSON string from Airtable
}

export default function OrderStatusPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.id as string;
  const email = searchParams.get('email');
  
  const [order, setOrder] = useState<ClubOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId && email) {
      fetchOrder();
    } else {
      setError('Missing order ID or email');
      setLoading(false);
    }
  }, [orderId, email]);

  const fetchOrder = async () => {
    try {
      console.log('Fetching order:', orderId, email);
      const response = await fetch(`/api/club/orders?orderId=${orderId}&email=${email}`);
      const data = await response.json();
      console.log('Order API response:', data);
      
      if (response.ok && data.order) {
        console.log('Setting order:', data.order);
        setOrder(data.order);
      } else {
        console.error('Order fetch failed:', data);
        setError(data.error || 'Order not found');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  const handleSecondPayment = async () => {
    try {
      const response = await fetch('/api/club/payment/second', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, email })
      });

      const data = await response.json();
      
      if (response.ok) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Failed to create payment session');
    }
  };

  const handleFinalPayment = async () => {
    try {
      const response = await fetch('/api/club/payment/final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, email })
      });

      const data = await response.json();
      
      if (response.ok) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Failed to create payment session');
    }
  };

  const getStatusBadge = (orderStatus: string, paymentStatus: string) => {
    if (paymentStatus === 'Fully Paid') {
      return <Badge className="bg-green-500">Fully Paid</Badge>;
    }
    
    if (paymentStatus === 'Final Payment Due') {
      return <Badge className="bg-orange-500">Final Payment Due</Badge>;
    }
    
    if (paymentStatus === 'Second Payment Due') {
      return <Badge className="bg-yellow-500">Second Payment Due</Badge>;
    }
    
    return <Badge className="bg-blue-500">Deposit Paid</Badge>;
  };

  const getOrderItems = (cartItems: any[]) => {
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return 'No items';
    }
    return cartItems.map((item: any) => {
      const itemQty = Object.values(item.sizeRun || {}).reduce((sum: number, qty: any) => sum + (qty || 0), 0);
      return `${item.gearType || 'Item'}: ${itemQty} units`;
    }).join(', ');
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-navy mb-8">Order Status</h1>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-navy mb-8">Order Status</h1>
            <p className="text-red-600">Error: {error}</p>
            <Link href="/club/get-started">
              <Button className="mt-4">Start New Order</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Safety check - don't render if no order
  if (!order) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-lg text-text/70">Order not found or loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#F7F7F7' }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Order Status</h1>
          <p className="text-text/70">Track your Club Vonga order progress</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-navy">{order['Organization Name']}</CardTitle>
                <p className="text-text/70 mt-1">
                  Order #{order.id.slice(0, 8)} • {order['Starter Kit'] === 'Core' ? 'Core Kit' : 'Pro Kit'}
                </p>
              </div>
              {getStatusBadge(order['Order Status'], order['Payment Status'])}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-navy mb-2">Order Details</h3>
                <div className="space-y-1 text-sm text-text/70">
                  <p><strong>Contact:</strong> {order['Contact Name']}</p>
                  <p><strong>Email:</strong> {order['Email']}</p>
                  <p><strong>Total Units:</strong> {order['Total Units']}</p>
                  <p><strong>Items:</strong> {getOrderItems((() => {
                    try {
                      return JSON.parse(order['Cart Items'] || '[]');
                    } catch {
                      return [];
                    }
                  })())}</p>
                  <p><strong>Order Date:</strong> {new Date(order['Created At']).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-navy mb-2">Payment Schedule</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Initial Deposit (10%):</span>
                    <span className="font-semibold text-green-600">${order['Deposit Amount'].toLocaleString()} ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Design Approval (40%):</span>
                    <span className={`font-semibold ${order['Payment Status'] === 'Second Payment Due' || order['Payment Status'] === 'Final Payment Due' || order['Payment Status'] === 'Fully Paid' ? 'text-green-600' : 'text-text/70'}`}>
                      ${order['Second Payment Amount'].toLocaleString()} {order['Payment Status'] === 'Second Payment Due' || order['Payment Status'] === 'Final Payment Due' || order['Payment Status'] === 'Fully Paid' ? '✓' : ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Before Shipment (50%):</span>
                    <span className={`font-semibold ${order['Payment Status'] === 'Final Payment Due' || order['Payment Status'] === 'Fully Paid' ? 'text-green-600' : 'text-text/70'}`}>
                      ${order['Final Payment Amount'].toLocaleString()} {order['Payment Status'] === 'Final Payment Due' || order['Payment Status'] === 'Fully Paid' ? '✓' : ''}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${order['Subtotal'].toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Actions */}
            {order['Payment Status'] === 'Second Payment Due' && (
              <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">Design Approved - Payment Required</h3>
                <p className="text-sm text-text/70 mb-4">
                  Your design has been approved! Please complete the second payment of ${order['Second Payment Amount'].toLocaleString()} to begin production.
                </p>
                <Button onClick={handleSecondPayment} className="bg-accent hover:bg-accent/90 text-navy">
                  Pay ${order['Second Payment Amount'].toLocaleString()} (40%)
                </Button>
              </div>
            )}

            {order['Payment Status'] === 'Final Payment Due' && (
              <div className="mt-6 p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">Ready to Ship - Final Payment Required</h3>
                <p className="text-sm text-text/70 mb-4">
                  Your order is ready to ship! Please complete the final payment of ${order['Final Payment Amount'].toLocaleString()} to initiate shipment.
                </p>
                <Button onClick={handleFinalPayment} className="bg-accent hover:bg-accent/90 text-navy">
                  Pay ${order['Final Payment Amount'].toLocaleString()} (50%)
                </Button>
              </div>
            )}

            {order['Payment Status'] === 'Fully Paid' && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">Order Complete!</h3>
                <p className="text-sm text-text/70">
                  All payments have been received. Your order will be shipped soon!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/club/get-started">
            <Button variant="outline">Start New Order</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
