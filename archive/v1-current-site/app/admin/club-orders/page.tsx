'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

export default function AdminClubOrdersPage() {
  const [orders, setOrders] = useState<ClubOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/club/orders');
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDesign = async (orderId: string) => {
    try {
      const response = await fetch('/api/admin/approve-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Design approved! Customer will receive payment link.');
        fetchOrders(); // Refresh orders
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Failed to approve design');
    }
  };

  const handleReadyToShip = async (orderId: string) => {
    try {
      const response = await fetch('/api/admin/ready-to-ship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Order ready for final payment! Customer will receive payment link.');
        fetchOrders(); // Refresh orders
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Failed to mark ready for shipping');
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
    return cartItems.map((item: any) => {
      const itemQty = Object.values(item.sizeRun).reduce((sum: number, qty: any) => sum + qty, 0);
      return `${item.gearType}: ${itemQty} units`;
    }).join(', ');
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-navy mb-8">Club Vonga Orders</h1>
            <p>Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-navy mb-8">Club Vonga Orders</h1>
            <p className="text-red-600">Error: {error}</p>
            <Button onClick={fetchOrders} className="mt-4">Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#F7F7F7' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Club Vonga Orders</h1>
          <p className="text-text/70">Manage orders and trigger follow-up payments</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-text/70">No orders found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders && Array.isArray(orders) && orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-navy">{order['Organization Name']}</CardTitle>
                      <p className="text-sm text-text/70 mt-1">
                        {order['Contact Name']} • {order['Email']}
                      </p>
                      <p className="text-sm text-text/70">
                        {order['Starter Kit'] === 'Core' ? 'Core Kit' : 'Pro Kit'} • {order['Total Units']} units
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order['Order Status'], order['Payment Status'])}
                      <p className="text-sm text-text/70 mt-2">
                        Created: {new Date(order['Created At']).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-semibold text-navy">Order Items</p>
                      <p className="text-sm text-text/70">{getOrderItems((() => {
                        try {
                          return JSON.parse(order['Cart Items'] || '[]');
                        } catch {
                          return [];
                        }
                      })())}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">Payment Breakdown</p>
                      <div className="text-sm text-text/70 space-y-1">
                        <p>Total: ${order['Subtotal'].toLocaleString()}</p>
                        <p>Deposit: ${order['Deposit Amount'].toLocaleString()} ✓</p>
                        <p>Second: ${order['Second Payment Amount'].toLocaleString()}</p>
                        <p>Final: ${order['Final Payment Amount'].toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">Actions</p>
                      <div className="space-y-2">
                        {order['Payment Status'] === 'Deposit Paid' && (
                          <Button 
                            onClick={() => handleApproveDesign(order.id)}
                            className="w-full bg-accent hover:bg-accent/90 text-navy"
                          >
                            Approve Design
                          </Button>
                        )}
                        {order['Payment Status'] === 'Second Payment Due' && (
                          <Button 
                            onClick={() => handleReadyToShip(order.id)}
                            className="w-full bg-accent hover:bg-accent/90 text-navy"
                          >
                            Ready to Ship
                          </Button>
                        )}
                        {order['Payment Status'] === 'Final Payment Due' && (
                          <p className="text-sm text-text/70">Waiting for final payment</p>
                        )}
                        {order['Payment Status'] === 'Fully Paid' && (
                          <p className="text-sm text-green-600">Order complete</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
