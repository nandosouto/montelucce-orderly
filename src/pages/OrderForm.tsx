
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const OrderForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_cliente: '',
    email: '',
    cpf: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    preco_produto: '',
    marca_produto: '',
    custo_envio: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validar formulário
    if (!formData.nome_cliente || !formData.email || !formData.cpf || 
        !formData.cep || !formData.endereco || !formData.numero || 
        !formData.preco_produto || !formData.marca_produto || !formData.custo_envio) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      setIsLoading(false);
      return;
    }
    
    try {
      // Salvar no Supabase
      const { error } = await supabase
        .from('pedidos')
        .insert({
          nome_cliente: formData.nome_cliente,
          email: formData.email,
          cpf: formData.cpf,
          cep: formData.cep,
          endereco: formData.endereco,
          numero: formData.numero,
          complemento: formData.complemento || null,
          preco_produto: parseFloat(formData.preco_produto),
          marca_produto: formData.marca_produto,
          custo_envio: parseFloat(formData.custo_envio)
        });
        
      if (error) {
        throw error;
      }
      
      // Mostrar mensagem de sucesso
      toast.success('Pedido enviado com sucesso!');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      toast.error('Erro ao enviar pedido. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
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
          <h2 className="text-2xl font-semibold text-montelucce-yellow mb-4">Obrigado pelo seu pedido!</h2>
          <p className="text-montelucce-light-gray">Por favor, aguarde o envio do seu pedido.</p>
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
          <h1 className="text-2xl font-semibold text-montelucce-yellow mb-6 text-center">Informações do Pedido</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-montelucce-light-gray border-b border-montelucce-yellow/10 pb-2">
                Informações Pessoais
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="nome_cliente" className="block text-sm font-medium text-montelucce-light-gray">
                    Nome Completo *
                  </label>
                  <Input
                    id="nome_cliente"
                    name="nome_cliente"
                    value={formData.nome_cliente}
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
                    CPF *
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
                Informações de Entrega
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="cep" className="block text-sm font-medium text-montelucce-light-gray">
                    CEP *
                  </label>
                  <Input
                    id="cep"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="endereco" className="block text-sm font-medium text-montelucce-light-gray">
                    Endereço *
                  </label>
                  <Input
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="numero" className="block text-sm font-medium text-montelucce-light-gray">
                    Número *
                  </label>
                  <Input
                    id="numero"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="complemento" className="block text-sm font-medium text-montelucce-light-gray">
                    Complemento
                  </label>
                  <Input
                    id="complemento"
                    name="complemento"
                    value={formData.complemento}
                    onChange={handleChange}
                    className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-montelucce-light-gray border-b border-montelucce-yellow/10 pb-2">
                Informações do Produto
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="marca_produto" className="block text-sm font-medium text-montelucce-light-gray">
                    Marca do Produto *
                  </label>
                  <Input
                    id="marca_produto"
                    name="marca_produto"
                    value={formData.marca_produto}
                    onChange={handleChange}
                    className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="preco_produto" className="block text-sm font-medium text-montelucce-light-gray">
                    Preço do Produto (R$) *
                  </label>
                  <Input
                    id="preco_produto"
                    name="preco_produto"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.preco_produto}
                    onChange={handleChange}
                    className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="custo_envio" className="block text-sm font-medium text-montelucce-light-gray">
                    Custo de Envio (R$) *
                  </label>
                  <Input
                    id="custo_envio"
                    name="custo_envio"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.custo_envio}
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
                disabled={isLoading}
                className="w-full md:w-auto bg-montelucce-yellow text-montelucce-black hover:bg-montelucce-yellow/90 text-lg py-6 px-8"
              >
                {isLoading ? 'Enviando...' : 'Enviar Pedido'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderForm;
