"use client"

import { useState, useEffect } from "react"
import {
  Headphones,
  Keyboard,
  Mouse,
  Speaker,
  Search,
  ShoppingBag,
  Camera,
  ChevronDown,
  Sun,
  Moon,
  Cable,
  Zap,
  Star,
  Heart,
  Plus,
  Minus,
  X,
  Filter,
  Grid,
  List,
  Instagram,
  RefreshCw,
  TrendingUp,
} from "lucide-react"
import DVDBouncer from "@/components/dvd-bouncer"
import CursorTracker from "@/components/cursor-tracker"
import LoadingScreen from "@/components/loading-screen"

// Product type definition
interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  rating: number
  reviews: number
  description: string
  features: string[]
  inStock: boolean
  discount: number
}

// Cart item type definition
interface CartItem extends Product {
  quantity: number
}

// Product data with actual images
const products: Product[] = [
  {
    id: 1,
    name: "DopeTech Mechanical Keyboard",
    price: 299.99,
    originalPrice: 349.99,
    image: "/products/keyboard.png",
    category: "keyboard",
    rating: 4.8,
    reviews: 124,
    description: "Premium mechanical keyboard with Cherry MX switches",
    features: ["RGB Backlight", "Wireless", "Programmable Keys"],
    inStock: true,
    discount: 14
  },
  {
    id: 2,
    name: "DopeTech Gaming Mouse",
    price: 89.99,
    originalPrice: 119.99,
    image: "/products/Screenshot 2025-08-02 215024.png",
    category: "mouse",
    rating: 4.9,
    reviews: 89,
    description: "High-precision gaming mouse with 25,600 DPI",
    features: ["25,600 DPI", "RGB", "Programmable Buttons"],
    inStock: true,
    discount: 25
  },
  {
    id: 3,
    name: "DopeTech Wireless Headphones",
    price: 199.99,
    originalPrice: 249.99,
    image: "/products/Screenshot 2025-08-02 215007.png",
    category: "audio",
    rating: 4.7,
    reviews: 156,
    description: "Studio-grade wireless headphones with ANC",
    features: ["Active Noise Cancellation", "40h Battery", "Bluetooth 5.0"],
    inStock: true,
    discount: 20
  },
  {
    id: 4,
    name: "DopeTech Smart Speaker",
    price: 149.99,
    originalPrice: 179.99,
    image: "/products/Screenshot 2025-08-02 215110.png",
    category: "speaker",
    rating: 4.6,
    reviews: 73,
    description: "360-degree smart speaker with voice control",
    features: ["360° Audio", "Voice Control", "Smart Home Integration"],
    inStock: false,
    discount: 17
  },
  {
    id: 5,
    name: "DopeTech Security Key",
    price: 49.99,
    originalPrice: 59.99,
    image: "/products/key.png",
    category: "accessories",
    rating: 4.5,
    reviews: 42,
    description: "Biometric security key for enhanced protection",
    features: ["Fingerprint Sensor", "NFC", "Water Resistant"],
    inStock: true,
    discount: 17
  }
]

export default function DopeTechEcommerce() {
  const [scrollY, setScrollY] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev => prev.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categories = [
    { id: "all", name: "All Products", icon: Grid },
    { id: "keyboard", name: "Keyboards", icon: Keyboard },
    { id: "mouse", name: "Mice", icon: Mouse },
    { id: "audio", name: "Audio", icon: Headphones },
    { id: "speaker", name: "Speakers", icon: Speaker },
    { id: "accessories", name: "Accessories", icon: Cable },
  ]

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
      <CursorTracker />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 dopetech-nav">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/images/dopetech-logo-new.png" alt="DopeTech" className="w-12 h-12 logo-adaptive" />
              <span className="text-xl font-semibold jakarta-subtitle">DopeTech Store</span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F7DD0F] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-5">
              <button className="nav-icon-button cursor-hover" aria-label="Search">
                <Search className="w-5 h-5 hover:text-[#F7DD0F] transition-colors" />
              </button>

              {/* Shopping Cart with Badge */}
              <button 
                onClick={() => setCartOpen(true)}
                className="nav-icon-button cursor-hover relative" 
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 hover:text-[#F7DD0F] transition-colors" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#F7DD0F] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getCartCount()}
                  </span>
                )}
              </button>

              <button onClick={toggleDarkMode} className="nav-icon-button cursor-hover" aria-label="Toggle dark mode">
                {isDarkMode ? <Sun className="w-5 h-5 text-[#F7DD0F]" /> : <Moon className="w-5 h-5 text-gray-700" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="pt-24 pb-16 gradient-bg-light">
        <div className="max-w-7xl mx-auto px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to <span className="text-[#F7DD0F]">DopeTech</span> Store
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Premium Tech Gear for Every Setup
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 cursor-hover ${
                  selectedCategory === category.id
                    ? "bg-[#F7DD0F] text-black shadow-lg"
                    : "bg-white/10 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-[#F7DD0F]/10"
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">View:</span>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid" ? "bg-[#F7DD0F] text-black" : "bg-white/10 hover:bg-[#F7DD0F]/10"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list" ? "bg-[#F7DD0F] text-black" : "bg-white/10 hover:bg-[#F7DD0F]/10"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredProducts.length} products found
            </div>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-8 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {filteredProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="dopetech-card p-6 h-full flex flex-col">
                  {/* Product Image */}
                  <div className="relative mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                        -{product.discount}%
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded-full text-sm">
                        Out of Stock
                      </div>
                    )}
                    <button className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ({product.reviews})
                      </span>
                    </div>

                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs bg-[#F7DD0F]/20 text-[#F7DD0F] px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="mt-auto">
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl font-bold">${product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-lg text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                          product.inStock
                            ? "bg-[#F7DD0F] text-black hover:bg-[#F7DD0F]/90 hover:scale-105"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dope Picks Marquee Section */}
      <section className="pt-16 pb-16 gradient-bg-golden-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Dope <span className="text-[#F7DD0F]">Picks</span>
            </h2>
            <p className="text-xl text-gray-300">
              Latest dope drops
            </p>
          </div>

          {/* Marquee Container */}
          <div className="relative">
            {/* Single Marquee Row */}
            <div className="flex animate-marquee space-x-8">
              {products.map((product, index) => (
                <div key={product.id} className="group relative flex-shrink-0">
                  <div className="relative overflow-hidden rounded-2xl w-80 h-80">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Product Name Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-[#F7DD0F] font-bold text-xl">${product.price}</p>
                    </div>
                    
                    {/* NEW Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      NEW
                    </div>
                    
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  
                  {/* Floating Action Button */}
                  <button
                    onClick={() => addToCart(product)}
                    className="absolute -bottom-3 -right-3 bg-[#F7DD0F] text-black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shopping Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          
          {/* Cart Panel */}
          <div className="relative ml-auto w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Cart Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">Shopping Cart</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                          <p className="text-[#F7DD0F] font-bold">${item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-[#F7DD0F]">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-[#F7DD0F] text-black py-3 px-4 rounded-lg font-medium hover:bg-[#F7DD0F]/90 transition-colors">
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black py-16 border-t-2 border-[#F7DD0F]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <img src="/images/dopetech-logo-new.png" alt="DopeTech" className="w-10 h-10 logo-adaptive" />
              <span className="text-sm text-white jakarta-light">© 2024 DopeTech Store. All rights reserved.</span>
            </div>

            <div className="flex space-x-8">
              <a href="#" className="text-sm text-gray-400 hover:text-[#F7DD0F] transition-colors cursor-hover jakarta-light">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-[#F7DD0F] transition-colors cursor-hover jakarta-light">
                Terms of Use
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-[#F7DD0F] transition-colors cursor-hover jakarta-light">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
