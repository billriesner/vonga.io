'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, ChevronLeft, ChevronRight, Upload, AlertCircle, Plus, Minus, X } from 'lucide-react';
import Link from 'next/link';

// Define the schema for form validation
const formSchema = z.object({
  // Step 1: Organization Info
  organizationName: z.string().min(2, 'Organization name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  organizationType: z.enum(['gym', 'golf', 'club', 'other']),
  memberCount: z.number().min(100, 'Minimum 100 units required'),
  
  // Step 2: Gear Selection (cart items)
  cartItems: z.array(z.object({
    gearType: z.string(),
    sizeRun: z.object({
      xs: z.number().min(0),
      s: z.number().min(0),
      m: z.number().min(0),
      l: z.number().min(0),
      xl: z.number().min(0),
      xxl: z.number().min(0),
    }),
  })).min(1, 'Add at least one item to your cart'),
  starterKit: z.enum(['core', 'pro']),
  
  // Step 3: Branding
  logoFile: z.any().optional(),
  brandColors: z.string().optional(),
  designNotes: z.string().optional(),
  
  // Step 4: Rewards
  rewardCheckIn: z.boolean(),
  rewardMilestone: z.boolean(),
  rewardReferral: z.boolean(),
  rewardEvents: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

const GEAR_PRICING = {
  hat: [
    { min: 100, max: 499, price: 25 },
    { min: 500, max: 999, price: 20 },
    { min: 1000, max: Infinity, price: 0 }, // Custom pricing
  ],
  tshirt: [
    { min: 100, max: 499, price: 20 },
    { min: 500, max: 999, price: 15 },
    { min: 1000, max: Infinity, price: 0 }, // Custom pricing
  ],
  tank: [
    { min: 100, max: 499, price: 20 },
    { min: 500, max: 999, price: 15 },
    { min: 1000, max: Infinity, price: 0 }, // Custom pricing
  ],
  polo: [
    { min: 100, max: 499, price: 25 },
    { min: 500, max: 999, price: 20 },
    { min: 1000, max: Infinity, price: 0 }, // Custom pricing
  ],
  hoodie: [
    { min: 100, max: 499, price: 35 },
    { min: 500, max: 999, price: 30 },
    { min: 1000, max: Infinity, price: 0 }, // Custom pricing
  ],
};

export default function GetStartedPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<Array<{ gearType: string; sizeRun: { xs: number; s: number; m: number; l: number; xl: number; xxl: number } }>>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      memberCount: 100,
      cartItems: [],
      starterKit: 'core',
      rewardCheckIn: false,
      rewardMilestone: false,
      rewardReferral: false,
      rewardEvents: false,
    },
  });

  const watchedValues = watch();
  const totalUnits = watchedValues.memberCount || 0;
  const starterKit = watchedValues.starterKit || 'core';
  
  // Calculate total units from cart
  const cartTotalUnits = cartItems.reduce((total, item) => {
    const itemTotal = Object.values(item.sizeRun).reduce((sum, qty) => sum + qty, 0);
    return total + itemTotal;
  }, 0);

  const calculatePricing = () => {
    // Check if any item requires custom pricing (1000+ units)
    const hasCustomPricing = cartTotalUnits >= 1000;
    
    if (hasCustomPricing) {
      return { itemizedCosts: [], subtotal: 0, deposit: 0, isCustom: true };
    }

    // Calculate cost for each cart item based on total order volume
    const itemizedCosts = cartItems.map((item) => {
      const itemQty = Object.values(item.sizeRun).reduce((sum, qty) => sum + qty, 0);
      const gearType = item.gearType as keyof typeof GEAR_PRICING;
      const pricingTiers = GEAR_PRICING[gearType];
      
      if (!pricingTiers) {
        return { gearType: item.gearType, quantity: itemQty, unitPrice: 0, total: 0 };
      }

      // Find price tier based on TOTAL order volume (not individual item)
      const tier = pricingTiers.find(
        (t) => cartTotalUnits >= t.min && cartTotalUnits <= t.max
      );
      
      let basePrice = tier?.price || 0;
      
      // Add $10 to each item for Pro Kit
      if (starterKit === 'pro') {
        basePrice += 10;
      }
      
      const total = itemQty * basePrice;

      return {
        gearType: item.gearType,
        quantity: itemQty,
        unitPrice: basePrice,
        total,
      };
    });

    const subtotal = itemizedCosts.reduce((sum, item) => sum + item.total, 0);
    const deposit = subtotal * 0.1; // 10% deposit due upfront

    return { itemizedCosts, subtotal, deposit, isCustom: false };
  };

  const pricing = calculatePricing();
  const shouldShowDemo = cartTotalUnits >= 500 || pricing.subtotal >= 10000;

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['organizationName', 'contactName', 'email', 'phone', 'organizationType', 'memberCount'];
        break;
      case 2:
        // Validate cart items and starter kit
        if (cartItems.length === 0) {
          alert('Please add at least one item to your cart');
          return;
        }
        // Validate 100 unit minimum
        if (cartTotalUnits < 100) {
          alert('Minimum 100 units required. Please add more items to your cart.');
          return;
        }
        fieldsToValidate = ['starterKit'];
        break;
      case 3:
        fieldsToValidate = ['brandColors', 'designNotes'];
        break;
      case 4:
        fieldsToValidate = ['rewardCheckIn', 'rewardMilestone', 'rewardReferral', 'rewardEvents'];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      // Update form value with cart items before proceeding
      if (currentStep === 2) {
        setValue('cartItems', cartItems);
      }
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/club/get-started', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Your request has been submitted! We\'ll be in touch soon.');
      } else {
        alert('Something went wrong. Please try again or contact us directly.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayDeposit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/club/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          starterKit,
          depositAmount: pricing.deposit,
          subtotal: pricing.subtotal,
          memberCount: watchedValues.memberCount,
          organizationName: watchedValues.organizationName,
          email: watchedValues.email,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create payment session. Please try requesting an invoice instead.');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Payment error. Please try requesting an invoice or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestInvoice = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/club/request-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(watchedValues),
      });

      if (response.ok) {
        alert('Invoice request sent! We\'ll email you within 24 hours.');
      } else {
        alert('Something went wrong. Please contact us directly.');
      }
    } catch (error) {
      console.error('Error requesting invoice:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookDemo = async () => {
    try {
      await fetch('/api/club/book-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...watchedValues, trigger: 'high_value_lead' }),
      });
      window.location.href = '/enterprise#demo';
    } catch (error) {
      console.error('Error booking demo:', error);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('logoFile', file);
      setLogoFileName(file.name);
      
      // Only preview SVG files (other vector formats won't render in browser)
      if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For AI, PSD, EPS files - just show filename
        setLogoPreview(null);
      }
    }
  };

  // Cart management functions
  const addToCart = (gearType: string) => {
    const newItem = {
      gearType,
      sizeRun: { xs: 0, s: 20, m: 30, l: 30, xl: 15, xxl: 5 },
    };
    setCartItems([...cartItems, newItem]);
  };

  const removeFromCart = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const updateCartItemSize = (index: number, size: string, value: number) => {
    const updated = [...cartItems];
    updated[index].sizeRun[size as keyof typeof updated[number]['sizeRun']] = value;
    setCartItems(updated);
  };

  const GEAR_OPTIONS = [
    { value: 'tshirt', label: 'T-Shirt' },
    { value: 'tank', label: 'Tank Top' },
    { value: 'hoodie', label: 'Hoodie' },
    { value: 'polo', label: 'Polo' },
    { value: 'hat', label: 'Hat' },
  ];

  return (
    <div className="min-h-screen py-4xl" style={{ backgroundColor: '#F7F7F7' }}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-3xl">
          <div className="flex items-center justify-between mb-md">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 5 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step === currentStep
                      ? 'text-navy'
                      : step < currentStep
                      ? 'text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                  style={
                    step === currentStep 
                      ? { backgroundColor: '#33BECC' } 
                      : step < currentStep
                      ? { backgroundColor: '#303E55' }
                      : {}
                  }
                >
                  {step < currentStep ? <CheckCircle2 className="w-6 h-6" /> : step}
                </div>
                {step < 5 && (
                  <div
                    className="h-1 flex-1 mx-2"
                    style={{ backgroundColor: step < currentStep ? '#303E55' : '#D1D5DB' }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs font-semibold text-text/70">
            <span>Organization</span>
            <span>Gear</span>
            <span>Branding</span>
            <span>Rewards</span>
            <span>Pricing</span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-2 border-muted shadow-xl" style={{ backgroundColor: '#FFFFFF' }}>
          <CardHeader>
            <CardTitle className="text-navy text-3xl font-bold">
              {currentStep === 1 && 'Tell Us About Your Organization'}
              {currentStep === 2 && 'Choose Your Gear'}
              {currentStep === 3 && 'Add Your Branding'}
              {currentStep === 4 && 'Select Rewards'}
              {currentStep === 5 && 'Review & Pay'}
            </CardTitle>
            <CardDescription className="text-base" style={{ color: '#33BECC' }}>
              {currentStep === 1 && 'Basic information to get started'}
              {currentStep === 2 && 'Select apparel type and size distribution'}
              {currentStep === 3 && 'Upload your logo and brand details'}
              {currentStep === 4 && 'Choose which rewards to enable'}
              {currentStep === 5 && 'Review your order and complete payment'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Organization Info */}
              {currentStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div>
                    <label className="block text-sm font-semibold mb-sm text-navy">
                      Organization Name *
                    </label>
                    <input
                      {...register('organizationName')}
                      type="text"
                      className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
                      placeholder="Your gym, club, or organization"
                    />
                    {errors.organizationName && (
                      <p className="text-sm text-red-600 mt-sm">{errors.organizationName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-sm text-navy">
                      Contact Name *
                    </label>
                    <input
                      {...register('contactName')}
                      type="text"
                      className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
                      placeholder="Your full name"
                    />
                    {errors.contactName && (
                      <p className="text-sm text-red-600 mt-sm">{errors.contactName.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    <div>
                      <label className="block text-sm font-semibold mb-sm text-navy">
                        Email *
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-sm">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-sm text-navy">
                        Phone *
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
                        placeholder="(555) 555-5555"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600 mt-sm">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-sm text-navy">
                      Organization Type *
                    </label>
                    <select
                      {...register('organizationType')}
                      className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
                    >
                      <option value="">Select type</option>
                      <option value="gym">Gym / Fitness Studio</option>
                      <option value="golf">Golf Course / Country Club</option>
                      <option value="club">Sports Club / Community</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.organizationType && (
                      <p className="text-sm text-red-600 mt-sm">{errors.organizationType.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-sm text-navy">
                      How many units do you need? *
                    </label>
                    <input
                      {...register('memberCount', { valueAsNumber: true })}
                      type="number"
                      min="100"
                      className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
                      placeholder="100"
                    />
                    {errors.memberCount && (
                      <p className="text-sm text-red-600 mt-sm font-semibold">{errors.memberCount.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Gear Selection with Cart */}
              {currentStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* Starter Kit Selection */}
                  <div>
                    <label className="block text-sm font-semibold mb-sm text-navy">
                      Starter Kit *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                      <button
                        type="button"
                        onClick={() => setValue('starterKit', 'core')}
                        className={`p-lg border-2 rounded text-left transition-all ${
                          starterKit === 'core'
                            ? 'border-accent bg-accent/10'
                            : 'border-muted hover:border-accent/50'
                        }`}
                      >
                        <h3 className="font-bold text-lg text-navy mb-sm">Core Kit</h3>
                        <p className="text-sm text-text/70 mb-sm">For gyms and smaller communities</p>
                        <p className="text-2xl font-bold text-navy">$15-45/unit*</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setValue('starterKit', 'pro')}
                        className={`p-lg border-2 rounded text-left transition-all ${
                          starterKit === 'pro'
                            ? 'border-accent bg-accent/10'
                            : 'border-muted hover:border-accent/50'
                        }`}
                      >
                        <h3 className="font-bold text-lg text-navy mb-sm">Pro Kit</h3>
                        <p className="text-sm text-text/70 mb-sm">For golf courses and premium clubs</p>
                        <p className="text-2xl font-bold text-navy">$25-50/unit*</p>
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <div>
                    <label className="block text-sm font-semibold mb-sm text-navy">
                      Add Gear to Your Order
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-sm">
                      {GEAR_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => addToCart(option.value)}
                          className="p-md border-2 border-muted rounded hover:border-accent transition-colors text-sm font-semibold text-navy bg-white"
                        >
                          <Plus className="w-4 h-4 inline mr-xs" />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cart Summary */}
                  <div className="bg-gray-100 rounded-lg p-lg border-2 border-muted">
                    <div className="flex items-center justify-between mb-md">
                      <h3 className="text-lg font-bold text-navy">Your Order</h3>
                      <div className="text-sm font-semibold" style={{ color: '#33BECC' }}>
                        Total: {cartTotalUnits} units
                      </div>
                    </div>

                    {cartItems.length === 0 ? (
                      <p className="text-sm text-text/70 text-center py-lg">
                        Click the buttons above to add items to your order
                      </p>
                    ) : (
                      <div className="space-y-md">
                        {cartItems.map((item, index) => {
                          const itemTotal = Object.values(item.sizeRun).reduce((sum, qty) => sum + qty, 0);
                          return (
                            <div key={index} className="bg-white rounded p-md border-2 border-muted">
                              <div className="flex items-center justify-between mb-sm">
                                <h4 className="font-semibold text-navy">
                                  {GEAR_OPTIONS.find(g => g.value === item.gearType)?.label}
                                </h4>
                                <div className="flex items-center gap-md">
                                  <span className="text-sm font-semibold text-navy">{itemTotal} units</span>
                                  <button
                                    type="button"
                                    onClick={() => removeFromCart(index)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 md:grid-cols-6 gap-xs mt-sm">
                                {['xs', 's', 'm', 'l', 'xl', 'xxl'].map((size) => (
                                  <div key={size}>
                                    <label className="block text-xs font-semibold mb-xs text-navy uppercase text-center">
                                      {size}
                                    </label>
                                    <input
                                      type="number"
                                      min="0"
                                      value={item.sizeRun[size as keyof typeof item.sizeRun]}
                                      onChange={(e) => updateCartItemSize(index, size, parseInt(e.target.value) || 0)}
                                      className="w-full px-sm py-xs border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent text-navy bg-white text-center"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {cartTotalUnits > 0 && cartTotalUnits < 100 && (
                      <div className="mt-md p-md bg-red-50 border-2 border-red-300 rounded">
                        <p className="text-sm font-semibold text-red-600 text-center">
                          ⚠️ You need {100 - cartTotalUnits} more units to meet the 100 unit minimum
                        </p>
                      </div>
                    )}
                    {cartTotalUnits >= 100 && (
                      <div className="mt-md p-md bg-green-50 border-2 border-green-300 rounded">
                        <p className="text-sm font-semibold text-green-600 text-center">
                          ✓ {cartTotalUnits} unit{cartTotalUnits !== 1 ? 's' : ''} in cart
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Branding */}
              {currentStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div>
                    <label className="block text-sm font-semibold mb-sm text-navy">
                      Upload Logo
                    </label>
                    <div className="border-2 border-dashed border-muted rounded-lg p-xl text-center hover:border-accent transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept=".svg,.ai,.psd,.eps"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        {logoFileName ? (
                          <div className="space-y-md">
                            {logoPreview ? (
                              <img src={logoPreview} alt="Logo preview" className="max-h-32 mx-auto" />
                            ) : (
                              <div className="bg-accent/10 rounded-lg p-lg border-2 border-accent">
                                <Upload className="w-12 h-12 mx-auto text-accent mb-sm" />
                                <p className="text-sm font-semibold text-navy">{logoFileName}</p>
                              </div>
                            )}
                            <p className="text-sm text-accent font-semibold">Click to change</p>
                          </div>
                        ) : (
                          <div className="space-y-md">
                            <Upload className="w-12 h-12 mx-auto text-accent" />
                            <p className="text-sm text-navy font-semibold">Click to upload logo</p>
                            <p className="text-xs text-text/70">Vector files only: SVG, AI, PSD, EPS (up to 10MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-sm text-navy">
                      Brand Colors (Hex Codes or Pantone)
                    </label>
                    <input
                      {...register('brandColors')}
                      type="text"
                      className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
                      placeholder="e.g., #1A4D8F, Pantone 2945 C"
                    />
                    <p className="text-xs text-text/70 mt-sm">Provide hex codes (e.g., #1A4D8F) or Pantone numbers (e.g., Pantone 2945 C) for accurate color matching</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-sm text-navy">
                      Design Notes
                    </label>
                    <textarea
                      {...register('designNotes')}
                      rows={4}
                      className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-navy bg-white"
                      placeholder="e.g., Logo should be on left chest of shirts, keep branding minimal and clean, prefer navy blue accents, company name on back..."
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Rewards */}
              {currentStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                  <p className="text-sm text-text/70 mb-xl">
                    Select which rewards you'd like to enable for your members. You can customize these later in the dashboard.
                  </p>

                  <div className="space-y-xl">
                    <label className="flex items-start border-2 border-muted rounded hover:border-accent transition-colors cursor-pointer" style={{ gap: '32px', padding: '24px' }}>
                      <input
                        {...register('rewardCheckIn')}
                        type="checkbox"
                        className="mt-1 w-5 h-5 text-accent border-gray-300 rounded focus:ring-accent"
                      />
                      <div>
                        <h3 className="font-semibold text-navy">Check-In Rewards</h3>
                        <p className="text-sm text-text/70">Members earn points for each tap-in visit</p>
                      </div>
                    </label>

                    <label className="flex items-start border-2 border-muted rounded hover:border-accent transition-colors cursor-pointer" style={{ gap: '32px', padding: '24px' }}>
                      <input
                        {...register('rewardMilestone')}
                        type="checkbox"
                        className="mt-1 w-5 h-5 text-accent border-gray-300 rounded focus:ring-accent"
                      />
                      <div>
                        <h3 className="font-semibold text-navy">Milestone Rewards</h3>
                        <p className="text-sm text-text/70">Special rewards for 10, 25, 50+ visits</p>
                      </div>
                    </label>

                    <label className="flex items-start border-2 border-muted rounded hover:border-accent transition-colors cursor-pointer" style={{ gap: '32px', padding: '24px' }}>
                      <input
                        {...register('rewardReferral')}
                        type="checkbox"
                        className="mt-1 w-5 h-5 text-accent border-gray-300 rounded focus:ring-accent"
                      />
                      <div>
                        <h3 className="font-semibold text-navy">Referral Rewards</h3>
                        <p className="text-sm text-text/70">Reward members who bring friends</p>
                      </div>
                    </label>

                    <label className="flex items-start border-2 border-muted rounded hover:border-accent transition-colors cursor-pointer" style={{ gap: '32px', padding: '24px' }}>
                      <input
                        {...register('rewardEvents')}
                        type="checkbox"
                        className="mt-1 w-5 h-5 text-accent border-gray-300 rounded focus:ring-accent"
                      />
                      <div>
                        <h3 className="font-semibold text-navy">Exclusive Events</h3>
                        <p className="text-sm text-text/70">Special events for top members</p>
                      </div>
                    </label>
                  </div>

                </div>
              )}

              {/* Step 5: Pricing & Payment */}
              {currentStep === 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  <div className="bg-gray-100 rounded-lg p-xl">
                    <h3 className="text-xl font-bold text-navy mb-lg">Order Summary</h3>
                    
                    {!pricing.isCustom && pricing.itemizedCosts && pricing.itemizedCosts.length > 0 ? (
                      <div className="space-y-md mb-lg">
                        {/* Itemized Costs */}
                        {pricing.itemizedCosts.map((item, index) => (
                          <div key={index} className="pb-sm border-b border-gray-300">
                            <div className="flex justify-between text-sm mb-xs">
                              <span className="font-semibold text-navy">
                                {GEAR_OPTIONS.find(g => g.value === item.gearType)?.label}
                              </span>
                              <span className="text-text/70">{item.quantity} units</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-text/70">@ ${item.unitPrice}/unit</span>
                              <span className="font-semibold text-navy">${item.total.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                        
                        <div className="flex justify-between text-sm pt-md">
                          <span className="text-text/70">Total Units:</span>
                          <span className="font-semibold text-navy">{cartTotalUnits}</span>
                        </div>
                        
                        <div className="flex justify-between text-base font-bold pt-md border-t-2 border-gray-300">
                          <span className="text-navy">Order Total:</span>
                          <span className="text-navy">${pricing.subtotal.toLocaleString()}</span>
                        </div>

                        {/* Payment Schedule */}
                        <div className="bg-white rounded-lg p-md mt-md border-2 border-muted">
                          <h4 className="font-bold text-navy mb-sm text-sm">Payment Schedule:</h4>
                          <div className="space-y-xs text-sm">
                            <div className="flex justify-between">
                              <span className="text-text/70">1. Initial Deposit (Due Now):</span>
                              <span className="font-bold" style={{ color: '#33BECC' }}>${pricing.deposit.toLocaleString()} (10%)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text/70">2. Design Approval:</span>
                              <span className="font-semibold text-navy">${(pricing.subtotal * 0.4).toLocaleString()} (40%)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text/70">3. Before Shipment:</span>
                              <span className="font-semibold text-navy">${(pricing.subtotal * 0.5).toLocaleString()} (50%)</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between text-2xl font-bold pt-md" style={{ color: '#33BECC' }}>
                          <span>Due Today:</span>
                          <span>${pricing.deposit.toLocaleString()}</span>
                        </div>
                      </div>
                    ) : pricing.isCustom ? (
                      <div className="bg-accent/10 border-2 border-accent rounded p-md">
                        <div className="flex items-start gap-sm">
                          <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-navy">Custom Pricing Required</p>
                            <p className="text-xs text-text/70">Orders of 1000+ units require custom quotes. We'll contact you within 24 hours.</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-text/70 text-center py-lg">
                        Add items to your cart in Step 2 to see pricing
                      </p>
                    )}
                  </div>

                  {shouldShowDemo && (
                    <div className="bg-navy rounded-lg p-xl text-center">
                      <h3 className="text-2xl font-bold text-accent mb-md">Qualify for White-Glove Service</h3>
                      <p className="text-white mb-lg">
                        Your order qualifies for our premium onboarding experience. Let's connect to discuss your needs.
                      </p>
                      <Button
                        type="button"
                        onClick={handleBookDemo}
                        className="bg-accent hover:bg-accent/90 text-navy font-semibold shadow-md"
                        size="lg"
                      >
                        Let's Connect
                      </Button>
                    </div>
                  )}

                  {!pricing.isCustom && pricing.itemizedCosts && pricing.itemizedCosts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                      <Button
                        type="button"
                        onClick={handlePayDeposit}
                        className="w-full text-navy font-semibold shadow-md py-xl text-lg"
                        style={{ backgroundColor: '#33BECC' }}
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Redirecting to Payment...' : `Pay $${pricing.deposit.toLocaleString()} Deposit`}
                      </Button>

                      <Button
                        type="button"
                        onClick={handleRequestInvoice}
                        variant="outline"
                        className="w-full border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold shadow-md py-xl text-lg"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Request Invoice'}
                      </Button>
                    </div>
                  )}

                  {pricing.isCustom && (
                    <Button
                      type="button"
                      onClick={handleRequestInvoice}
                      className="w-full bg-accent hover:bg-accent/90 text-navy font-semibold shadow-md py-xl text-lg"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Request Custom Quote'}
                    </Button>
                  )}

                  <p className="text-xs text-text/70 text-center">
                    By proceeding, you agree to our terms of service. Remaining balance due upon production completion.
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 5 && (
                <div className="flex items-center justify-between mt-xl pt-xl border-t-2 border-gray-200">
                  <Button
                    type="button"
                    onClick={handlePrev}
                    variant="outline"
                    className={`border-2 border-gray-300 text-navy hover:bg-gray-100 ${
                      currentStep === 1 ? 'invisible' : ''
                    }`}
                    disabled={currentStep === 1}
                  >
                    <ChevronLeft className="w-5 h-5 mr-sm" />
                    Previous
                  </Button>

                  <Button
                    type="button"
                    onClick={handleNext}
                    className="text-navy font-semibold shadow-lg"
                    style={{ backgroundColor: '#33BECC' }}
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-sm" />
                  </Button>
                </div>
              )}

              {currentStep === 5 && (
                <div className="flex items-center justify-start mt-xl pt-xl border-t-2 border-gray-200">
                  <Button
                    type="button"
                    onClick={handlePrev}
                    variant="outline"
                    className="border-2 border-gray-300 text-navy hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-5 h-5 mr-sm" />
                    Previous
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="mt-xl text-center">
          <p className="text-sm text-text/70 mb-sm">
            Questions? Need help?{' '}
            <Link href="/intake" className="text-navy font-semibold hover:underline">
              Contact our team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
