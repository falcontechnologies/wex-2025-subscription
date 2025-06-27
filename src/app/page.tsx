'use client';
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { prisma } from '@/lib/prisma';
import { MoreVertical, Trash2, Copy, Edit } from "lucide-react";

interface Subscription {
  id: string;
  name: string;
  provider: string;
  start_date?: string;
  expiry_date: string;
  payment_period: number;
  payment_amount: number;
  payment_method?: string;
  subscription_type?: string;
}

const Page = () => {
  const { status } = useSession();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    payment_amount: '',
    payment_period: '',
    start_date: '',
    expiry_date: '',
    payment_method: '',
    subscription_type: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingSubscription) return;

    try {
      const response = await fetch(`/api/subscriptions/${editingSubscription.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          payment_amount: parseFloat(formData.payment_amount),
          payment_period: parseInt(formData.payment_period)
        }),
      });

      if (response.ok) {
        const updatedSubscription = await response.json();
        setSubscriptions(prev => 
          prev.map(sub =>
            sub.id === editingSubscription.id ? updatedSubscription : sub
          )
        );
        setIsEditModalOpen(false);
        setEditingSubscription(null);
        setFormData({
          name: '',
          payment_amount: '',
          payment_period: '',
          start_date: '',
          expiry_date: '',
          payment_method: '',
          subscription_type: ''
        });
        console.log('Subscription updated successfully');
      } else {
        throw new Error('Failed to update subscription');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('Failed to update subscription. Please try again');
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
  
  useEffect(() => {
    const fetchSubscriptions = async () => {
      const res = await fetch("/api/subscriptions");
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data);
      }
    }
    if (status === "authenticated") {
      fetchSubscriptions();
    }
  }, [status]);

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown])

  const formatCurrency = (amount: number | string) => {
    return `$${Number(amount).toFixed(2)}`;
  };

  const formatPaymentPeriod = (period: number) => {
    if (period === 1) return 'Monthly';
    if (period === 12) return 'Yearly';
    return `${period} months`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric',
      month: 'short',
      year: undefined
    });
  };

  const calculateRenewalDate = (expiryDate: string, paymentPeriod: number) => {
    const expiry = new Date(expiryDate);
    const renewal = new Date(expiry);
    renewal.setMonth(renewal.getMonth() - paymentPeriod);
    return renewal.toISOString();
  };

  const getPaymentMethodImage = (paymentMethod: string) => {
    const method = paymentMethod?.toLowerCase();
    switch (method) {
      case 'credit card':
        return '/creditcard.png'
      case 'apple pay':
        return '/applepay.png';
      case 'paypal':
        return '/paypal.png';
      case 'google pay':
        return '/googlepay.png';
      default:
        return '/creditcard.png';
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between py-4">
          
          <Link href="/">
            <img
              src="/subtalonlogo.png"
              alt="Subtalon Logo"
              className="w-40 h-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          <nav className="flex gap-12">
            <NavLink href="/profile" label="Profile" />
            <NavLink href="" label="Subscriptions" />
            <NavLink href="/calendar" label="Calendar" />
            <NavLink href="/statistics" label="Statistics" />
            <NavLink href="/settings" label="Settings" />
            <NavLink href="/about" label="About" />
          </nav>

          <div className="pl-8">
            <Button
              variant="outline"
              className="text-xl transition-all duration-300 hover:bg-red-500 hover:text-white"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
            <span className="text-lg">+</span>
            New Subscription
          </Button>
        </div>
        
        <div className="space-y-4">
          {subscriptions.map((subscription: Subscription) => (
            <div key={subscription.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                {/* brand name and photo thing*/}
                <div className="flex items-center gap-4" style={{ minWidth: '200px' }}>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-sm">
                      {subscription.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-lg">
                      {subscription.name}
                    </h3>
                    {subscription.subscription_type && (
                      <p className="text-sm text-gray-500">
                        {subscription.subscription_type}
                      </p>
                    )}
                  </div>
                </div>

                {/* payment period */}
                <div className="flex items-center justify-center gap-2" style={{ minWidth: '120px' }}>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-gray-600">
                    {subscription.payment_period ? formatPaymentPeriod(subscription.payment_period) : 'Monthly'}
                  </span>
                </div>

                {/* date */}
                <div className="text-center" style={{ minWidth: '100px' }}>
                  <span className="text-gray-600">
                    {formatDate(calculateRenewalDate(subscription.expiry_date, subscription.payment_period))}
                  </span>
                </div>

                {/* price */}
                <div className="text-center" style={{ minWidth: '100px' }}>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(subscription.payment_amount)}
                  </div>
                </div>

                {/* payment method image */}
                <div className="flex items-center justify-center" style={{ minWidth: '60px' }}>
                  {subscription.payment_method && (
                    <img
                      src={getPaymentMethodImage(subscription.payment_method)}
                      alt={subscription.payment_method}
                      className="w-12 h-12 object-contain"
                    />
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(activeDropdown === subscription.id ? null : subscription.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>

                  {activeDropdown === subscription.id && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <button
                        onClick={() => {
                          setEditingSubscription(subscription);
                          setFormData({
                            name: subscription.name,
                            payment_amount: String(subscription.payment_amount),
                            payment_period: String(subscription.payment_period),
                            start_date: subscription.start_date || '',
                            expiry_date: subscription.expiry_date,
                            payment_method: subscription.payment_method || '',
                            subscription_type: subscription.subscription_type || ''
                          });
                          setIsEditModalOpen(true);
                          setActiveDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => {/*handle clone */}}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Clone
                      </button>
                      <button
                        onClick={() => {/*handle delete*/}}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {subscriptions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No subscriptions found</p>
          </div>
        )}
      </div>
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Subscription</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Subscription name"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subscription Type
                </label>
                <input
                  type="text"
                  name="subscription_type"
                  value={formData.subscription_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Software, Entertainment, Professional"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount
                </label>
                <input
                  type="number"
                  name="payment_amount"
                  value={formData.payment_amount}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Period (months)
                </label>
                <input
                  type="number"
                  name="payment_period"
                  value={formData.payment_period}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1 for monthly, 12 for yearly"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select payment method</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Apple Pay">Apple Pay</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Google Pay">Google Pay</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date ? formData.expiry_date.split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const NavLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="relative text-3xl font-medium text-gray-800 hover:text-red-600 transition-colors duration-300
               after:content-[''] after:absolute after:left-1/2 after:translate-x-[-50%] after:-bottom-1
               after:h-[3px] after:w-0 hover:after:w-1/3 after:bg-red-600 after:transition-all after:duration-300"
  >
    {label}
  </Link>
);

export default Page;