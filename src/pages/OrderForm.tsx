
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const OrderForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    cpf: '',
    zipCode: '',
    address: '',
    addressNumber: '',
    addressComplement: '',
    productPrice: '',
    productBrand: '',
    shippingCost: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.customerName || !formData.email || !formData.cpf || 
        !formData.zipCode || !formData.address || !formData.addressNumber || 
        !formData.productPrice || !formData.productBrand || !formData.shippingCost) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // In a real implementation, this would send data to an API
    // For now, we'll simulate a successful submission
    
    // Show success message
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-montelucce-black text-montelucce-light-gray flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-montelucce-black/50 border border-montelucce-yellow/20 rounded-lg p-8 text-center"
        >
          <h2 className="text-2xl font-semibold text-montelucce-yellow mb-4">Thank you for your order!</h2>
          <p className="text-montelucce-light-gray">Please wait for your order to be shipped.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-montelucce-black text-montelucce-light-gray flex flex-col items-center p-4">
      <div className="max-w-3xl w-full">
        <div className="flex justify-center mb-8 mt-8">
          <img 
            src="https://i.ibb.co/w3zTz78/montelucce.png" 
            alt="Montelucce Logo" 
            className="h-16" 
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-montelucce-black/50 border border-montelucce-yellow/20 rounded-lg p-6 shadow-lg"
        >
          <h1 className="text-2xl font-semibold text-montelucce-yellow mb-6 text-center">Order Information</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-montelucce-light-gray border-b border-montelucce-yellow/10 pb-2">
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="customerName" className="block text-sm font-medium text-montelucce-light-gray">
                    Full Name *
                  </label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-montelucce-light-gray">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="cpf" className="block text-sm font-medium text-montelucce-light-gray">
                    CPF (Brazilian Tax ID) *
                  </label>
                  <Input
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-montelucce-light-gray border-b border-montelucce-yellow/10 pb-2">
                Shipping Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="zipCode" className="block text-sm font-medium text-montelucce-light-gray">
                    ZIP Code *
                  </label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium text-montelucce-light-gray">
                    Street *
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="addressNumber" className="block text-sm font-medium text-montelucce-light-gray">
                    Number *
                  </label>
                  <Input
                    id="addressNumber"
                    name="addressNumber"
                    value={formData.addressNumber}
                    onChange={handleChange}
                    className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="addressComplement" className="block text-sm font-medium text-montelucce-light-gray">
                    Complement
                  </label>
                  <Input
                    id="addressComplement"
                    name="addressComplement"
                    value={formData.addressComplement}
                    onChange={handleChange}
                    className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-montelucce-light-gray border-b border-montelucce-yellow/10 pb-2">
                Product Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="productBrand" className="block text-sm font-medium text-montelucce-light-gray">
                    Product Brand *
                  </label>
                  <Input
                    id="productBrand"
                    name="productBrand"
                    value={formData.productBrand}
                    onChange={handleChange}
                    className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="productPrice" className="block text-sm font-medium text-montelucce-light-gray">
                    Product Price (R$) *
                  </label>
                  <Input
                    id="productPrice"
                    name="productPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.productPrice}
                    onChange={handleChange}
                    className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="shippingCost" className="block text-sm font-medium text-montelucce-light-gray">
                    Shipping Cost (R$) *
                  </label>
                  <Input
                    id="shippingCost"
                    name="shippingCost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.shippingCost}
                    onChange={handleChange}
                    className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-center">
              <Button
                type="submit"
                className="w-full md:w-auto bg-montelucce-yellow text-montelucce-black hover:bg-montelucce-yellow/90 text-lg py-6 px-8"
              >
                Submit Order
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderForm;
