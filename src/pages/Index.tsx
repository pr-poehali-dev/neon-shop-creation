import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  specs: string[];
  inStock: boolean;
  brand: string;
}

interface CartItem extends Product {
  quantity: number;
}

const categories = [
  { id: 1, name: 'Для мототехники', icon: 'Bike', color: 'text-[hsl(var(--neon-cyan))]', items: ['Безопасность', 'Аксессуары', 'Управление', '3D печать'] },
  { id: 2, name: 'Умный дом', icon: 'Home', color: 'text-[hsl(var(--neon-purple))]', items: ['Климат', 'Безопасность', 'Управление'] },
  { id: 3, name: 'Ремонт и строительство', icon: 'Wrench', color: 'text-[hsl(var(--neon-pink))]', items: ['Органайзеры', 'Устройства'] },
  { id: 4, name: 'Дом и быт', icon: 'Lamp', color: 'text-[hsl(var(--neon-cyan))]', items: ['Аксессуары', 'Светильники', '3D печать'] },
  { id: 5, name: 'Наши проекты', icon: 'Lightbulb', color: 'text-[hsl(var(--neon-purple))]', items: ['Заказы', 'Изделия'] }
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Creality Ender-3 V3',
    category: '3D Принтеры',
    price: 25990,
    image: '/placeholder.svg',
    description: 'Высокоточный FDM 3D принтер для домашнего использования',
    specs: ['Область печати: 220×220×250 мм', 'Скорость: до 180 мм/с', 'Автокалибровка', 'Wi-Fi'],
    inStock: true,
    brand: 'Creality'
  },
  {
    id: 2,
    name: 'iPhone 15 Pro Max',
    category: 'Смартфоны',
    price: 119990,
    image: '/placeholder.svg',
    description: 'Флагманский смартфон с титановым корпусом',
    specs: ['A17 Pro', '256 GB', '6.7" ProMotion', 'Тройная камера 48MP'],
    inStock: true,
    brand: 'Apple'
  },
  {
    id: 3,
    name: 'ASUS ROG Strix G16',
    category: 'Ноутбуки',
    price: 159990,
    image: '/placeholder.svg',
    description: 'Игровой ноутбук нового поколения',
    specs: ['RTX 4070', 'i9-13980HX', '32GB DDR5', '16" 240Hz'],
    inStock: false,
    brand: 'ASUS'
  },
  {
    id: 4,
    name: 'Custom Gaming PC "Cyberpunk"',
    category: 'Компьютеры',
    price: 249990,
    image: '/placeholder.svg',
    description: 'Мощная игровая станция с RGB подсветкой',
    specs: ['RTX 4080', 'i9-14900K', '64GB DDR5', '2TB NVMe SSD'],
    inStock: true,
    brand: 'Custom'
  },
  {
    id: 5,
    name: 'Sony WH-1000XM5',
    category: 'Аудио',
    price: 34990,
    image: '/placeholder.svg',
    description: 'Премиальные наушники с шумоподавлением',
    specs: ['ANC', '30 часов работы', 'Hi-Res Audio', 'Мультиточка'],
    inStock: true,
    brand: 'Sony'
  },
  {
    id: 6,
    name: 'DJI Mini 4 Pro',
    category: 'Видео',
    price: 89990,
    image: '/placeholder.svg',
    description: 'Компактный дрон с 4K камерой',
    specs: ['4K 60fps', '34 мин полета', 'Omnidirectional', '249g'],
    inStock: true,
    brand: 'DJI'
  }
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageGallery, setShowImageGallery] = useState(false);

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === categories.find(c => c.id === selectedCategory)?.name;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success('Товар добавлен в корзину!');
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
    toast.info('Товар удалён из корзины');
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const quickOrder = () => {
    if (cart.length === 0) {
      toast.error('Корзина пуста');
      return;
    }
    toast.success('Заказ оформлен! Менеджер свяжется с вами в течение 5 минут');
    setCart([]);
  };

  const productImages = [
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg'
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-[hsl(var(--neon-cyan))] bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-[hsl(var(--neon-cyan))] neon-glow">
                CYBER TECH
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                Авторские устройства, органайзеры и электронные решения, созданные для тех, кто ценит порядок, надёжность и технологичность. Мы объединяем механику, электронику и практичность в каждом продукте.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
            <div className="relative w-96 hidden md:block">
              <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--neon-cyan))]" size={20} />
              <Input
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-[hsl(var(--neon-cyan))] text-foreground"
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative border-[hsl(var(--neon-cyan))] text-[hsl(var(--neon-cyan))] hover-glow">
                  <Icon name="ShoppingCart" size={20} />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-[hsl(var(--neon-pink))] text-black">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-card border-[hsl(var(--neon-cyan))] w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle className="text-[hsl(var(--neon-cyan))] text-2xl">Корзина</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <Card key={item.id} className="p-4 bg-muted border-[hsl(var(--neon-purple))]">
                          <div className="flex gap-4">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{item.name}</h3>
                              <p className="text-[hsl(var(--neon-cyan))] font-bold">{item.price.toLocaleString()} ₽</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="border-[hsl(var(--neon-cyan))] text-[hsl(var(--neon-cyan))]"
                                >
                                  -
                                </Button>
                                <span className="text-foreground">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="border-[hsl(var(--neon-cyan))] text-[hsl(var(--neon-cyan))]"
                                >
                                  +
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeFromCart(item.id)}
                                  className="ml-auto text-[hsl(var(--neon-pink))]"
                                >
                                  <Icon name="Trash2" size={16} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                      
                      <div className="border-t border-[hsl(var(--neon-cyan))] pt-4 space-y-3">
                        <div className="flex justify-between text-lg">
                          <span>Итого:</span>
                          <span className="text-[hsl(var(--neon-cyan))] font-bold">{totalPrice.toLocaleString()} ₽</span>
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-[hsl(var(--neon-purple))] text-black hover:bg-[hsl(var(--neon-pink))] neon-border">
                              Оформить заказ
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-[hsl(var(--neon-cyan))] max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-2xl text-[hsl(var(--neon-cyan))]">Оформление заказа</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Ваше имя</label>
                                <Input placeholder="Иван Иванов" className="bg-input border-[hsl(var(--neon-cyan))]" />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Телефон</label>
                                <Input placeholder="+7 (999) 123-45-67" className="bg-input border-[hsl(var(--neon-cyan))]" />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                                <Input placeholder="example@mail.ru" type="email" className="bg-input border-[hsl(var(--neon-cyan))]" />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Адрес доставки</label>
                                <Input placeholder="г. Москва, ул. Ленина, д. 1" className="bg-input border-[hsl(var(--neon-cyan))]" />
                              </div>
                              
                              <div className="border-t border-[hsl(var(--neon-cyan))]/30 pt-4">
                                <h4 className="font-bold text-[hsl(var(--neon-purple))] mb-3">Способ оплаты</h4>
                                <div className="space-y-2">
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start border-[hsl(var(--neon-cyan))] text-foreground hover:bg-[hsl(var(--neon-cyan))]/10"
                                    onClick={quickOrder}
                                  >
                                    <Icon name="CreditCard" size={20} className="mr-2 text-[hsl(var(--neon-cyan))]" />
                                    Банковская карта
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start border-[hsl(var(--neon-cyan))] text-foreground hover:bg-[hsl(var(--neon-cyan))]/10"
                                    onClick={quickOrder}
                                  >
                                    <Icon name="Wallet" size={20} className="mr-2 text-[hsl(var(--neon-purple))]" />
                                    СБП (Система быстрых платежей)
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start border-[hsl(var(--neon-cyan))] text-foreground hover:bg-[hsl(var(--neon-cyan))]/10"
                                    onClick={quickOrder}
                                  >
                                    <Icon name="Banknote" size={20} className="mr-2 text-[hsl(var(--neon-pink))]" />
                                    Наличными при получении
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="flex justify-between text-lg font-bold pt-2">
                                <span>К оплате:</span>
                                <span className="text-[hsl(var(--neon-cyan))]">{totalPrice.toLocaleString()} ₽</span>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          className="w-full border-[hsl(var(--neon-cyan))] text-[hsl(var(--neon-cyan))]"
                          onClick={quickOrder}
                        >
                          Быстрый заказ (звонок менеджера)
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-4xl font-bold text-center mb-8 text-[hsl(var(--neon-purple))] neon-glow">
            Каталог товаров
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {categories.map((category, index) => (
              <Card
                key={category.id}
                className={`p-6 cursor-pointer transition-all duration-300 hover-glow bg-card border-2 animate-slide-up ${
                  selectedCategory === category.id
                    ? `border-[hsl(var(--neon-cyan))] neon-border`
                    : 'border-muted'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              >
                <div className="flex flex-col items-center gap-3">
                  <Icon name={category.icon as any} className={`${category.color} animate-neon-pulse`} size={32} />
                  <h3 className="font-bold text-center text-sm">{category.name}</h3>
                  {selectedCategory === category.id && (
                    <div className="mt-2 space-y-1 w-full">
                      {category.items.map((item, i) => (
                        <p key={i} className="text-xs text-muted-foreground text-center">• {item}</p>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>



        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <Card
                key={product.id}
                className="overflow-hidden hover-glow bg-card border-[hsl(var(--neon-purple))] animate-slide-up cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  {!product.inStock && (
                    <Badge className="absolute top-2 right-2 bg-[hsl(var(--neon-pink))] text-black">
                      Нет в наличии
                    </Badge>
                  )}
                  {product.inStock && (
                    <Badge className="absolute top-2 right-2 bg-[hsl(var(--neon-cyan))] text-black">
                      В наличии
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <Badge variant="outline" className="mb-2 border-[hsl(var(--neon-cyan))] text-[hsl(var(--neon-cyan))]">
                    {product.category}
                  </Badge>
                  <h3 className="font-bold text-lg mb-2 text-foreground">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[hsl(var(--neon-cyan))]">
                      {product.price.toLocaleString()} ₽
                    </span>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      disabled={!product.inStock}
                      className="bg-[hsl(var(--neon-purple))] text-black hover:bg-[hsl(var(--neon-pink))] neon-border"
                    >
                      <Icon name="ShoppingCart" size={16} className="mr-2" />
                      В корзину
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="bg-card border-[hsl(var(--neon-cyan))] max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-[hsl(var(--neon-cyan))]">{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div 
                    className="relative cursor-pointer group overflow-hidden rounded-lg"
                    onClick={() => setShowImageGallery(true)}
                  >
                    <img 
                      src={productImages[selectedImageIndex]} 
                      alt={selectedProduct.name} 
                      className="w-full rounded-lg transition-transform group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Icon name="ZoomIn" size={48} className="text-[hsl(var(--neon-cyan))]" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {productImages.map((img, idx) => (
                      <div
                        key={idx}
                        className={`cursor-pointer rounded overflow-hidden border-2 transition-all ${
                          selectedImageIndex === idx
                            ? 'border-[hsl(var(--neon-cyan))] neon-border'
                            : 'border-muted hover:border-[hsl(var(--neon-purple))]'
                        }`}
                        onClick={() => setSelectedImageIndex(idx)}
                      >
                        <img src={img} alt={`${selectedProduct.name} ${idx + 1}`} className="w-full h-20 object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Badge className="bg-[hsl(var(--neon-purple))] text-black mb-2">
                      {selectedProduct.brand}
                    </Badge>
                    <p className="text-muted-foreground">{selectedProduct.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-[hsl(var(--neon-cyan))] mb-2">Характеристики:</h4>
                    <ul className="space-y-1">
                      {selectedProduct.specs.map((spec, i) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <Icon name="Check" size={16} className="text-[hsl(var(--neon-cyan))] mt-0.5" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-[hsl(var(--neon-cyan))]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-bold text-[hsl(var(--neon-cyan))]">
                        {selectedProduct.price.toLocaleString()} ₽
                      </span>
                      {selectedProduct.inStock ? (
                        <Badge className="bg-[hsl(var(--neon-cyan))] text-black">В наличии</Badge>
                      ) : (
                        <Badge className="bg-[hsl(var(--neon-pink))] text-black">Нет в наличии</Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-[hsl(var(--neon-purple))] text-black hover:bg-[hsl(var(--neon-pink))] neon-border"
                        onClick={() => {
                          addToCart(selectedProduct);
                          setSelectedProduct(null);
                        }}
                        disabled={!selectedProduct.inStock}
                      >
                        <Icon name="ShoppingCart" size={16} className="mr-2" />
                        Добавить в корзину
                      </Button>
                      
                      {!selectedProduct.inStock && (
                        <Button
                          variant="outline"
                          className="w-full border-[hsl(var(--neon-cyan))] text-[hsl(var(--neon-cyan))]"
                          onClick={() => {
                            toast.success('Вы подписаны на уведомления о поступлении товара');
                            setSelectedProduct(null);
                          }}
                        >
                          <Icon name="Bell" size={16} className="mr-2" />
                          Уведомить о поступлении
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-bold text-[hsl(var(--neon-pink))] mb-2">Рекомендуем также:</h4>
                    <div className="space-y-2">
                      {mockProducts
                        .filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
                        .slice(0, 2)
                        .map(p => (
                          <div
                            key={p.id}
                            className="flex items-center gap-2 cursor-pointer hover:bg-card p-2 rounded"
                            onClick={() => setSelectedProduct(p)}
                          >
                            <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-foreground">{p.name}</p>
                              <p className="text-xs text-[hsl(var(--neon-cyan))]">{p.price.toLocaleString()} ₽</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showImageGallery} onOpenChange={setShowImageGallery}>
        <DialogContent className="bg-card border-[hsl(var(--neon-cyan))] max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[hsl(var(--neon-cyan))]">Галерея изображений</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={productImages[selectedImageIndex]} 
                alt="Product" 
                className="w-full h-auto rounded-lg"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 border-[hsl(var(--neon-cyan))] bg-black/50 text-[hsl(var(--neon-cyan))]"
                onClick={() => setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)}
              >
                <Icon name="ChevronLeft" size={24} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 border-[hsl(var(--neon-cyan))] bg-black/50 text-[hsl(var(--neon-cyan))]"
                onClick={() => setSelectedImageIndex((prev) => (prev + 1) % productImages.length)}
              >
                <Icon name="ChevronRight" size={24} />
              </Button>
            </div>
            
            <div className="grid grid-cols-6 gap-2">
              {productImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`cursor-pointer rounded overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[hsl(var(--neon-cyan))] neon-border'
                      : 'border-muted hover:border-[hsl(var(--neon-purple))]'
                  }`}
                  onClick={() => setSelectedImageIndex(idx)}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-16 object-cover" />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="border-t border-[hsl(var(--neon-cyan))] bg-card/50 backdrop-blur-lg mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-[hsl(var(--neon-cyan))] neon-glow mb-4">CYBER TECH</h3>
              <p className="text-muted-foreground text-sm">
                Авторские устройства и электронные решения для современной жизни
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-[hsl(var(--neon-purple))] mb-3">Контакты</h4>
              <div className="space-y-2 text-sm text-foreground">
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={16} className="text-[hsl(var(--neon-cyan))]" />
                  <a href="tel:+79991234567" className="hover:text-[hsl(var(--neon-cyan))] transition-colors">
                    +7 (999) 123-45-67
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={16} className="text-[hsl(var(--neon-cyan))]" />
                  <a href="mailto:info@cybertech.ru" className="hover:text-[hsl(var(--neon-cyan))] transition-colors">
                    info@cybertech.ru
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="MapPin" size={16} className="text-[hsl(var(--neon-cyan))] mt-0.5" />
                  <span>г. Москва, ул. Технологическая, д. 42</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-[hsl(var(--neon-purple))] mb-3">Режим работы</h4>
              <div className="space-y-1 text-sm text-foreground">
                <p>Пн-Пт: 10:00 - 20:00</p>
                <p>Сб: 11:00 - 18:00</p>
                <p>Вс: выходной</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[hsl(var(--neon-cyan))]/30 pt-6 text-center">
            <p className="text-[hsl(var(--neon-cyan))] neon-glow">CYBER TECH © 2025</p>
            <p className="text-muted-foreground text-sm mt-2">Технологии будущего уже сегодня</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;