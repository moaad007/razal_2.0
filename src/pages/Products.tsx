import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';

const Products = () => {
  const navigate = useNavigate();
  const { data: products, isLoading, error, addProduct, deleteProduct } = useProducts();
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await addProduct({
        name: newProduct.name,
        price: Number(newProduct.price),
        category: newProduct.category,
      });

      setNewProduct({ name: '', price: '', category: '' });
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading products...</div>;
  }

  if (error) {
    return <div className="p-6">Error loading products: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2" />
          Back to Rooms
        </Button>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <form onSubmit={handleAddProduct} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-hotel-primary">Add New Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <Input
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full">Add Product</Button>
        </form>

        <div>
          <h2 className="text-2xl font-bold text-hotel-primary mb-4">Product List</h2>
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  category={product.category}
                  onAdd={() => {
                    deleteProduct(product.id);
                    toast.success(`Deleted ${product.name}`);
                  }}
                  deleteMode={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No products available. Add your first product above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;