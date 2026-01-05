import React, { useState, useEffect, useRef } from 'react';
import { getEvents, getCart, getNotifications } from './api';
import {
  Search,
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  Heart,
  Share2,
  Filter,
  ChevronDown,
  Menu,
  X,
  User,
  Bell,
  Settings,
  LogOut,
  Plus,
  Edit3,
  Trash2,
  Check,
  TrendingUp,
  Award,
  Target,
  DollarSign,
  Mail,
  Phone,
  Map,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  CheckCircle,
  AlertCircle as LucideAlertCircle, // renamed to avoid conflict
  CreditCard,
  Lock,
  Shield,
  Home,
  Ticket,
  FileText,
  HelpCircle,
  ShoppingCart as ShoppingCartIcon,
  Info as LucideInfo, // renamed
  UploadCloud // replaces CloudUpload
} from 'lucide-react';

const categories = ["All", "Technology", "Business", "Entertainment", "Healthcare", "Marketing", "Education", "Sports"];
const priceFilters = ["All", "Free", "Paid"];

// Event Card Component
const EventCard = ({
  event,
  onRegister,
  onAddToCart,
  onBookNow,
  isFavorited,
  onToggleFavorite,
  onViewDetails,
}) => (
  <div
    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:-translate-y-1"
    onClick={onViewDetails}
  >
    <div className="relative">
      {/* Use image_url from PostgreSQL or fallback to image */}
      <img 
        src={event.image_url || event.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
        alt={event.title}
        className="w-full h-48 object-cover"
      />
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(event.id);
        }}
        className="absolute top-4 left-4 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
      >
        <Heart className={`h-5 w-5 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
      </button>
      
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-blue-600">
        {event.category}
      </div>
      
      {/* Price Badges */}
      <div className="absolute top-4 right-4">
        {Number(event.price) === 0 ? (
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Free</div>
        ) : (
          <div className="bg-amber-400 text-white px-3 py-1 rounded-full text-sm font-medium">Paid</div>
        )}
      </div>
    </div>

    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{event.location}</span>
          </div>
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm font-medium text-gray-700">{event.rating || '4.5'}</span>
          <span className="ml-1 text-sm text-gray-500">({event.reviews || 0})</span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Date TBD"}
          </span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">{event.time || "TBD"}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-gray-600">
          <Users className="h-4 w-4 mr-1" />
          
          <span className="text-sm">{(event.capacity || 0).toLocaleString()} max attendees</span>
        </div>
        <div className={`text-lg font-bold ${Number(event.price) === 0 ? 'text-green-600' : 'text-blue-600'}`}>
          {Number(event.price) === 0 ? "Free" : `£${event.price}`}
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (Number(event.price) === 0) {
              onRegister(event);
            } else {
              onBookNow(event); 
            }
          }}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center shadow-md"
        >
          <Plus className="h-5 w-5 mr-2" />
          {Number(event.price) === 0 ? 'Register Now' : 'Book Now'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(event);
          }}
          className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium flex items-center"
        >
          <ShoppingCartIcon className="h-4 w-4 mr-1" />
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);

// Featured Event Card
const FeaturedEventCard = ({
  event,
  onRegister,
  onAddToCart,
  isFavorited,
  onToggleFavorite,
  onViewDetails,
}) => (
  <div
    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-1 shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
    onClick={onViewDetails}
  >
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="relative">
        <img 
          src={event.image_url || event.image} 
          alt={event.title} 
          className="w-full h-48 object-cover" 
        />
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(event.id);
          }}
          className="absolute top-4 left-4 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all z-10"
        >
          <Heart className={`h-5 w-5 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
        </button>
        
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-blue-600">
          {event.category}
        </div>
        
        <div className="absolute bottom-4 right-2 bg-gradient-to-r from-purple-700 to-fuchsia-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          FEATURED
        </div>

        <div className="absolute top-4 right-4">
          {Number(event.price) === 0 ? (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">FREE</div>
          ) : (
            <div className="bg-amber-400 text-white px-3 py-1 rounded-full text-sm font-medium">Paid</div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700">{event.rating || '4.5'}</span>
            <span className="ml-1 text-sm text-gray-500">({event.reviews || 0})</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{event.location}</span>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Date TBD"}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>{event.time || "TBD"}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className={`text-lg font-bold ${Number(event.price) === 0 ? 'text-green-600' : 'text-blue-600'}`}>
            {Number(event.price) === 0 ? "Free" : `£${event.price}`}
          </div>
          <div className="text-sm text-gray-600">
            {/* Safety check for attendees and capacity */}
            {(event.capacity || 0) - (event.attendees || 0)} spots left
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (Number(event.price) === 0) {
                onRegister(event);
              } else {
                onBookNowPaid(event); 
              }
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            {Number(event.price) === 0 ? 'Register Now' : 'Book Now'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(event);
            }}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium flex items-center"
          >
            <ShoppingCartIcon className="h-4 w-4 mr-1" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
);

// HomePage Component (now stable — defined outside App)
const HomePage = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  priceFilter,
  setPriceFilter,
  categories,
  priceFilters,
  filteredEvents,
  events,
  favorites,
  setFavorites,
  addNotification,
  handleRegister,
  handleAddToCart,
  //handleBookNowPaid,
  setSelectedEvent,
  registrationSuccess,
  setRegistrationSuccess,
  aboutRef,
  contactRef,
  searchInputRef,
  setCurrentView,
  setCheckoutStep 
}) => {
  // Local handler for "Book Now" from home
  const handleBookNowFromHome = (event) => {
    if (Number(event.price) === 0) {
      handleRegister(event); // free → register instantly
    } else {
      handleAddToCart(event); // paid → add to cart
      setCurrentView("cart"); // go straight to cart/checkout
      setCheckoutStep(0);     // reset to cart step
    }
  };

  return (
    <div className="bg-gradient-to-r  from-purple-800 via-fuchsia-800 to-purple-900 text-white relative overflow-hidden min-h-screen">
      <div className="bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover & Experience Amazing Events</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Find the perfect events for your interests, connect with like-minded people, and create unforgettable experiences.
            </p>
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search events, categories, or locations..."
                  className="w-full px-6 py-4 text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-13">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { value: "10,000+", label: "Events Hosted", color: "text-purple-700 dark:text-purple-400" },
            { value: "250,000+", label: "Happy Attendees", color: "text-fuchsia-700 dark:text-fuchsia-400" },
            { value: "98%", label: "Satisfaction Rate", color: "text-purple-700 dark:text-purple-400" },
            { value: "500+", label: "Event Organizers", color: "text-fuchsia-700 dark:text-fuchsia-400" }
          ].map((stat, i) => (
            <div key={i} className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center border border-gray-200 dark:border-gray-700">
              <div className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-300 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 md:mb-0">
            {selectedCategory === "All" ? "Filter Events" : `${selectedCategory} Events`}
          </h2>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <div className="flex space-x-4">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="relative">
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {priceFilters.map(filter => (
                    <option key={filter} value={filter}>{filter}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-md">
                <Filter className="h-5 w-5 text-gray-600" />
              </button>
              <button onClick={() => setCurrentView("organize")} className="bg-gradient-to-r from-purple-700 to-fuchsia-700 text-white p-2.5 rounded-xl shadow-lg hover:shadow-xl">
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {registrationSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p className="font-medium text-green-800">
                Successfully registered for "{registrationSuccess.eventName}" at {registrationSuccess.registrationTime}
              </p>
              <p className="text-green-700 text-sm mt-1">Check your email for confirmation details.</p>
            </div>
            <button onClick={() => setRegistrationSuccess(null)} className="ml-auto text-green-500 hover:text-green-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {selectedCategory === "All" && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.filter(event => event.featured).map(event => (
                <FeaturedEventCard
                  key={event.id}
                  event={event}
                  onRegister={handleRegister}
                  onAddToCart={handleAddToCart}
                  onBookNow={handleBookNowFromHome} // NEW PROP
                  isFavorited={favorites.includes(event.id)}
                  onToggleFavorite={(id) => {
                    setFavorites(prev => {
                      const isFav = prev.includes(id);
                      const newFavs = isFav
                        ? prev.filter(i => i !== id)
                        : [...prev, id];
                      const event = events.find(e => e.id === id);
                      const message = isFav
                        ? `Removed "${event.title}" from favorites`
                        : `Added "${event.title}" to favorites`;
                      addNotification(message, isFav ? 'info' : 'success');
                      return newFavs;
                    });
                  }}
                  onViewDetails={() => setSelectedEvent(event)}
                />
              ))}
            </div>
          </div>
        )}

        <h3 className="text-2xl font-bold text-white mb-6">All Events</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={handleRegister}
              onAddToCart={handleAddToCart}
              onBookNow={handleBookNowFromHome} // NEW PROP
              isFavorited={favorites.includes(event.id)}
              onToggleFavorite={(id) => {
                setFavorites(prev => {
                  const isFav = prev.includes(id);
                  const newFavs = isFav
                    ? prev.filter(i => i !== id)
                    : [...prev, id];
                  const event = events.find(e => e.id === id);
                  const message = isFav
                    ? `Removed "${event.title}" from favorites`
                    : `Added "${event.title}" to favorites`;
                  addNotification(message, isFav ? 'info' : 'success');
                  return newFavs;
                });
              }}
              onViewDetails={() => setSelectedEvent(event)}
            />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            <button onClick={() => { setSelectedCategory("All"); setPriceFilter("All"); setSearchTerm(""); }} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* About & Contact Sections */}
      <div ref={aboutRef} className=" bg-gradient-to-r  from-purple-600 via-fuchsia-700 to-purple-700 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mb-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">About EventPro</h2>
          <p className="mt-4 text-xl text-white max-w-3xl mx-auto">
            We're on a mission to connect people through shared experiences and unforgettable events.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">Community Focused</h3>
            <p className="mt-2 text-white">
              We believe in the power of bringing people together to share ideas, learn, and grow.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">Quality Events</h3>
            <p className="mt-2 text-white">
              We curate high-quality events with verified organisers to ensure the best experience.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">Trusted Platform</h3>
            <p className="mt-2 text-white">
              With over 250,000 satisfied attendees, we're the trusted choice for event discovery.
            </p>
          </div>
        </div>
      </div>

      <div ref={contactRef} className="bg-gradient-to-r from-purple-800 via-fuchsia-800 to-purple-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mb-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">Contact Us</h2>
          <p className="mt-4 text-xl text-slate-300 max-w-3xl mx-auto">
            Have questions or need assistance? Our team is here to help.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <Map className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-white">Address</h4>
                  <p className="mt-1 text-slate-300">
                    123 Event Street<br />
                    San Francisco, CA 94103<br />
                    United States
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-white">Phone</h4>
                  <p className="mt-1 text-slate-300">
                    +1 (800) 123-4567<br />
                    Mon-Fri, 9am-6pm PST
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-white">Email</h4>
                  <p className="mt-1 text-slate-300">
                    support@eventpro.com<br />
                    info@eventpro.com
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400"
                  placeholder="What is this regarding?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400"
                  placeholder="Your message..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Navigation (moved outside App)
const Navigation = ({
  events = [],
  currentView,
  setCurrentView,
  selectedEvent,
  setSelectedEvent,
  setCheckoutStep,
  setNotifications,
  notifications,
  setNotificationOpen,
  notificationOpen,
  favorites,
  setFavorites,
  setFavoritesOpen,
  favoritesOpen,
  cart,
  setCart,
  setCartOpen,
  cartOpen,
  user,
  aboutRef,
  contactRef,
  isMenuOpen,
  setIsMenuOpen,
  addNotification 
}) => (
  <nav className="bg-gray-900 text-white shadow-sm border-b z-50 sticky top-0">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0 flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <span className="ml-2 text-xl font-bold text-white">EventPro</span>
          </div>
          <div className="hidden md:ml-10 md:flex md:space-x-8">
            <button 
              onClick={() => { 
                setCurrentView("home"); 
                setSelectedEvent(null); 
                setCheckoutStep(0);
              }}
              className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === "home" && !selectedEvent ? "text-blue-600 border-b-2 border-blue-600" : "text-white hover:text-blue-600"}`}
            >
              Events
            </button>
            <button 
              onClick={() => { 
                setCurrentView("dashboard"); 
                setSelectedEvent(null); 
                setCheckoutStep(0);
              }}
              className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === "dashboard" ? "text-blue-600 border-b-2 border-blue-600" : "text-white hover:text-blue-600 "}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => { 
                setCurrentView("organize"); 
                setSelectedEvent(null); 
                setCheckoutStep(0);
              }}
              className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === "organize" ? "text-blue-600 border-b-2 border-blue-600" : "text-white hover:text-blue-600"}`}
            >
              Organise Event
            </button>
           
            <button 
              onClick={() => {
                // Always go to home first, then scroll
                if (currentView !== "home") {
                  setCurrentView("home");
                }
                // Trigger scroll regardless — will be handled in useEffect
                setTimeout(() => {
                  scrollToSection(aboutRef);
                }, 100); // Slight delay to let DOM settle
              }}
              className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === "home" ? "text-blue-600 border-b-2 border-blue-600" : "text-white hover:text-blue-600"}`}
            >
              About
            </button>

            <button 
              onClick={() => {
                if (currentView !== "home") {
                  setCurrentView("home");
                }
                setTimeout(() => {
                  scrollToSection(contactRef);
                }, 100);
              }}
              className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === "home" ? "text-blue-600 border-b-2 border-blue-600" : "text-white hover:text-blue-600"}`}
            >
              Contact
            </button>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                setCartOpen(false);
                setFavoritesOpen(false);
              }}
              className="text-yellow-400 hover:text-yellow-600 relative"
              aria-label="Toggle notifications"
            >
              <Bell className="h-5 w-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      }} 
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Mark all as read
                    </button>
                    <button 
                      onClick={() => {
                        setNotifications([]);
                      }} 
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">No notifications</p>
                  </div>
                ) : (
                  <div>
                    {notifications.map(notification => (
                      <div key={notification.id} className={`p-4 ${!notification.read ? 'bg-blue-50' : 'hover:bg-gray-50'} border-b border-gray-100`}>
                        <div className="flex">
                          <div className="flex-shrink-0">
                            {notification.type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                            {notification.type === "info" && <LucideInfo className="h-5 w-5 text-blue-500" />} {/* Lucide */}
                            {notification.type === "reminder" && <Calendar className="h-5 w-5 text-purple-500" />}
                            {notification.type === "error" && <LucideAlertCircle className="h-5 w-5 text-red-500" />} {/* Lucide */}
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-700">{notification.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <button 
                              onClick={() => {
                                setNotifications(prev => 
                                  prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
                                );
                              }} 
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="p-3 text-center text-sm text-blue-600 hover:text-blue-800 border-t border-gray-200">
                  View all notifications
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button 
              onClick={() => {
                setFavoritesOpen(!favoritesOpen);
                setCartOpen(false);
                setNotificationOpen(false);
              }}
              className="text-red-500 hover:text-red-700 relative"
              aria-label="Toggle favorites"
            >
              <Heart className={`h-5 w-5 ${favorites.length > 0 ? 'text-red-500 fill-current' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>
            {favoritesOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Favorites ({favorites.length})</h3>
                </div>
                {favorites.length === 0 ? (
                  <div className="p-6 text-center">
                    <Heart className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-gray-500">No favorites yet</p>
                    <p className="text-sm text-gray-400 mt-1">Click the ❤️ icon on events to save them here</p>
                  </div>
                ) : (
                  <div>
                    {favorites.map(favId => {
                      // Use optional chaining (?.) and ensure events is treated as an array
                      const event = (events || []).find(e => e.id === favId); 
                      if (!event) return null;
                      return (
                        <div key={favId} className="p-4 hover:bg-gray-50 border-b border-gray-100">
                          <div className="flex">
                            <img src={event.image} alt={event.title} className="w-12 h-12 rounded-lg object-cover" />
                            <div className="ml-3 flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              </div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setFavorites(prev => prev.filter(id => id !== favId));
                                addNotification(`Removed "${event.title}" from favorites`, "info");
                              }} 
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div 
                  className="p-3 text-center text-sm text-blue-600 hover:text-blue-800 border-t border-gray-200 cursor-pointer"
                  onClick={() => { 
                    setCurrentView("home"); 
                    setFavoritesOpen(false);
                  }}
                >
                  Browse more events
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="relative">
            <button 
              onClick={() => {
                if (cart.length > 0) {
                  setCartOpen(!cartOpen);
                  setNotificationOpen(false);
                  setFavoritesOpen(false);
                  setCurrentView("home");
                  setSelectedEvent(null);
                  setCheckoutStep(0);
                } else {
                  setCartOpen(false);
                }
              }}
              className="text-blue-500 hover:text-blue-700 relative"
              aria-label="Toggle cart"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {(cart.reduce((total, item) => total + (Number(item.tickets) || 0), 0)) || 0}
                </span>
              )}
            </button>
            {cartOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Shopping Cart ({cart.reduce((total, item) => total + item.tickets, 0)} items)</h3>
                </div>
                {cart.length === 0 ? (
                  <div className="p-6 text-center">
                    <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div>
                    {cart.map(item => (
                      <div key={item.id} className="p-4 hover:bg-gray-50 border-b border-gray-100">
                        <div className="flex">
                          <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="ml-3 flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.tickets} × ${item.price} = ${(item.price * item.tickets).toFixed(2)}
                            </p>
                          </div>
                          <button 
                            onClick={() => {
                              setCart(prev => prev.filter(i => i.id !== item.id));
                              addNotification(`Removed "${item.title}" from cart`, "info");
                            }} 
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {cart.length > 0 && (
                  <div className="p-4 bg-gray-50">
                    <div className="flex justify-between font-bold mb-3">
                      <span>Total:</span>
                      <span>£{getTotal(cart).toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => { 
                        setCartOpen(false); 
                        setCheckoutStep(0);
                        setCurrentView("cart"); // Navigate to cart view
                        setSelectedEvent(null); // ensure no detail page interferes
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
                    >
                      View Cart & Checkout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
              <span className="text-sm font-medium text-white hidden sm:inline">{user.name}</span>
            </div>
          </div>
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-gray-700">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </div>
    {isMenuOpen && (
      <div className="md:hidden bg-white border-t">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <button onClick={() => { setCurrentView("home"); setIsMenuOpen(false); setSelectedEvent(null); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 w-full text-left">
            Events
          </button>
          <button onClick={() => { setCurrentView("dashboard"); setIsMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 w-full text-left">
            Dashboard
          </button>
          <button onClick={() => { setCurrentView("organize"); setIsMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 w-full text-left">
            Organise Event
          </button>
          <button 
            onClick={() => {
              if (currentView !== "home") {
                setCurrentView("home");
                // Give a tiny delay for HomePage to render before scrolling
                setTimeout(() => {
                  scrollToSection(aboutRef);
                }, 100);
              } else {
                scrollToSection(aboutRef);
              }
              setIsMenuOpen(false);
            }} 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 w-full text-left"
          >
            About
          </button>
          <button 
            onClick={() => {
              if (currentView !== "home") {
                setCurrentView("home");
                setTimeout(() => {
                  scrollToSection(contactRef);
                }, 100);
              } else {
                scrollToSection(contactRef);
              }
              setIsMenuOpen(false);
            }} 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 w-full text-left"
          >
            Contact
          </button>
          <div className="pt-4 pb-2 border-t border-gray-200">
            <div className="flex items-center px-4">
              <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user.name}</div>
                <div className="text-sm font-medium text-gray-500">{user.email}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </nav>
);

// Helper functions
// Use Number() to prevent string concatenation and NaN errors
const getSubtotal = (items) =>
  (items || []).reduce((total, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.tickets) || 1;
    return total + (price * qty);
  }, 0);

const getServiceFee = (items) => getSubtotal(items) * 0.02; // 2%
const getTotal = (items) => getSubtotal(items) + getServiceFee(items);

const scrollToSection = (ref) => {
  if (ref?.current) {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // Fallback: try again after a frame
    requestAnimationFrame(() => {
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
};


// Checkout Details — Dark Theme
const CheckoutDetails = ({
  checkoutData,
  updateCheckoutData,
  setCheckoutStep
}) => (
  <div className="bg-gradient-to-r from-purple-800 via-fuchsia-800 to-purple-900 min-h-screen text-white">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => setCheckoutStep(0)}
          className="mb-4 flex items-center text-purple-200 hover:text-white"
        >
          <ChevronDown className="h-4 w-4 rotate-90 mr-1" />
          Back to cart
        </button>
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-slate-300 mt-2">Enter your details to complete your purchase</p>
      </div>
      <div className="bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-700">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={checkoutData.firstName}
                onChange={(e) => updateCheckoutData('firstName', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={checkoutData.lastName}
                onChange={(e) => updateCheckoutData('lastName', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400"
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={checkoutData.email}
              onChange={(e) => updateCheckoutData('email', e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400"
              placeholder="Enter email address"
            />
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={checkoutData.phone}
              onChange={(e) => updateCheckoutData('phone', e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400"
              placeholder="Enter phone number"
            />
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Billing Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Address Line 1 *
              </label>
              <input
                type="text"
                value={checkoutData.billingAddress}
                onChange={(e) => updateCheckoutData('billingAddress', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400"
                placeholder="Enter street address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                City *
              </label>
              <input
                type="text"
                value={checkoutData.city}
                onChange={(e) => updateCheckoutData('city', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400"
                placeholder="Enter city"
              />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                State/Province
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400"
                placeholder="Enter state"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                ZIP/Postal Code *
              </label>
              <input
                type="text"
                value={checkoutData.zip}
                onChange={(e) => updateCheckoutData('zip', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400"
                placeholder="Enter ZIP code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Country *
              </label>
              <select
                value={checkoutData.country}
                onChange={(e) => updateCheckoutData('country', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option className="bg-slate-800">United States</option>
                <option className="bg-slate-800">Canada</option>
                <option className="bg-slate-800">United Kingdom</option>
                <option className="bg-slate-800">Australia</option>
                <option className="bg-slate-800">Germany</option>
                <option className="bg-slate-800">France</option>
                <option className="bg-slate-800">Japan</option>
                <option className="bg-slate-800">India</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between pt-6 gap-4">
          <button
            onClick={() => setCheckoutStep(0)}
            className="px-6 py-3 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 font-medium"
          >
            Back to Cart
          </button>
          <button
            onClick={() => setCheckoutStep(2)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white rounded-lg font-medium shadow-md"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CheckoutPayment = ({
  cart = [],
  checkoutData,
  updateCheckoutData,
  setCheckoutStep,
  processCheckout
}) => (
  <div className="bg-gradient-to-r from-purple-800 via-fuchsia-800 to-purple-900 min-h-screen text-white">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => setCheckoutStep(1)}
          className="mb-4 flex items-center text-purple-200 hover:text-white"
        >
          <ChevronDown className="h-4 w-4 rotate-90 mr-1" />
          Back to details
        </button>
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-slate-300 mt-2">Enter your payment information to complete your purchase</p>
      </div>
      <div className="bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-700">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          <div className="space-y-3">
            {[
              { id: 'creditCard', label: 'Credit/Debit Card', icon: CreditCard },
              { id: 'paypal', label: 'PayPal', icon: LucideInfo },
              { id: 'applePay', label: 'Apple Pay', icon: LucideInfo },
            ].map(({ id, label, icon: Icon }) => (
              <label key={id} className="flex items-center p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:bg-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={id}
                  defaultChecked={id === 'creditCard'}
                  className="mr-3 h-5 w-5 text-purple-500 focus:ring-purple-500"
                />
                <Icon className="h-5 w-5 text-slate-400 mr-3" />
                <span className="text-slate-200">{label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Card Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Card Number *
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={checkoutData.cardNumber}
                  onChange={(e) => updateCheckoutData('cardNumber', e.target.value)}
                  className="w-full pl-10 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Expiry *
                </label>
                <input
                  type="text"
                  value={checkoutData.expiry}
                  onChange={(e) => updateCheckoutData('expiry', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  CVV *
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={checkoutData.cvv}
                    onChange={(e) => updateCheckoutData('cvv', e.target.value)}
                    className="w-full pl-8 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Billing Address</h2>
          <p className="text-slate-400 text-sm">
            Same as contact info: {checkoutData.billingAddress}, {checkoutData.city}, {checkoutData.zip}, {checkoutData.country}
          </p>
          <button className="mt-2 text-sm text-purple-400 hover:text-purple-300 font-medium">
            Edit billing address
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between pt-6 gap-4">
          <button
            onClick={() => setCheckoutStep(1)}
            className="px-6 py-3 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 font-medium"
          >
            Back to Details
          </button>
          <button
            onClick={processCheckout}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium shadow-md flex items-center"
          >
            Confirm and Pay ${getTotal(cart).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CheckoutConfirmation = ({
  cart,
  checkoutData,
  setCheckoutStep,
  setCart,
  setCurrentView
}) => {
  // Use global helpers
  const subtotal = getSubtotal(cart);
  const serviceFee = getServiceFee(cart); // 2%
  const total = getTotal(cart);

  return (
    <div className="bg-gradient-to-r from-purple-800 via-fuchsia-800 to-purple-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-900/30 border border-green-700 mb-4">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Thank You for Your Order!</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Your order has been successfully processed. A confirmation email has been sent to{' '}
            <span className="font-medium text-slate-200">{checkoutData.email}</span>.
          </p>
        </div>
        <div className="bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-700">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-300">Subtotal</span>
                <span className="font-medium">£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Service Fee (2%)</span>
                <span className="font-medium">£{serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-700">
                <span className="font-bold">Total</span>
                <span className="font-bold text-xl text-purple-300">
                  £{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Your Tickets</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-start bg-slate-700/50 rounded-lg p-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {item.tickets} ticket{item.tickets > 1 ? 's' : ''} •{' '}
                      {new Date(item.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm font-medium text-slate-200 mt-1">
                      £{item.price} × {item.tickets} = £{(item.price * item.tickets).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-slate-200 mb-2">Contact Info</h3>
              <p className="text-slate-400 text-sm">
                {checkoutData.firstName} {checkoutData.lastName}
                <br />
                {checkoutData.email}
                <br />
                {checkoutData.phone}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-200 mb-2">Billing Address</h3>
              <p className="text-slate-400 text-sm">
                {checkoutData.billingAddress}
                <br />
                {checkoutData.city}, {checkoutData.zip}
                <br />
                {checkoutData.country}
              </p>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-700 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => {
                setCheckoutStep(0);
                setCart([]);
                setConfirmedOrder(null);
                setCurrentView('home');
              }}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium"
            >
              Browse More Events
            </button>
            <button
              onClick={() => {
                setCheckoutStep(0);
                setCart([]);
                setCurrentView('dashboard');
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white rounded-lg font-medium shadow-md"
            >
              View Dashboard
            </button>
          </div>
        </div>
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Need help? Contact us at <span className="text-purple-300">support@eventpro.com</span></p>
        </div>
      </div>
    </div>
  );
};

// Main App
const App = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [draftToEdit, setDraftToEdit] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [user] = useState({ 
    name: "Kossai Al Brawy", 
    email: "Kossai.AL-Brawy@example.com",
    avatar: "https://placehold.co/40x40/3b82f6/white?text=KA",
    favorites: [3] 
  });
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([3]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [checkoutData, setCheckoutData] = useState({
    firstName: "Kossai",
    lastName: "Al Brawy",
    email: "Kossai.AL-Brawy@example.com",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    billingAddress: "",
    city: "",
    zip: "",
    country: "United Kingdom"
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [drafts, setDrafts] = useState([]); // state for drafts
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const searchInputRef = useRef(null);
  

  // Filter events
  useEffect(() => {
    let result = [...events];

    if (selectedCategory !== "All") {
      result = result.filter(event => event.category === selectedCategory);
    }

    if (priceFilter === "Free") {
      // Number() handles cases where the DB returns price as a string
      result = result.filter(event => Number(event.price) === 0);
    } else if (priceFilter === "Paid") {
      result = result.filter(event => Number(event.price) > 0);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(event => {
        // We use (value ?? "") to provide an empty string if the field is null/undefined
        const title = (event.title ?? "").toLowerCase();
        const location = (event.location ?? "").toLowerCase();
        const category = (event.category ?? "").toLowerCase();
        const organizer = (event.organizer ?? "").toLowerCase();

        return title.includes(term) || 
              location.includes(term) || 
              category.includes(term) || 
              organizer.includes(term);
      });
    }

    setFilteredEvents(result);
  }, [selectedCategory, priceFilter, searchTerm, events]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsRes, cartRes, notifRes] = await Promise.all([
          getEvents(),
          getCart(),
          getNotifications()
        ]);

        // Normalise price and other numeric fields
        const normalizedEvents = (eventsRes?.data || []).map(event => ({
          ...event,
          price: Number(event.price) || 0,
          capacity: Number(event.capacity) || 0,
          attendees: Number(event.attendees) || 0,
          rating: Number(event.rating) || 4.5,
          reviews: Number(event.reviews) || 0
        }));

        setEvents(normalizedEvents);

        // Also normalise cart items if they exist
        const normalizedCart = (cartRes?.data || []).map(item => ({
          ...item,
          price: Number(item.price) || 0,
          tickets: Number(item.tickets) || 1
        }));
        setCart(normalizedCart);

        setNotifications(notifRes?.data || []);
      } catch (error) {
        console.error("Backend Connection Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Add notification
  const addNotification = (text, type = "info") => {
    const newNotification = {
      id: Date.now(),
      text,
      time: "Just now",
      read: false,
      type
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Handle registration
  const handleRegister = (event) => {
    // Prevent duplicate registration
    if (registeredEvents.has(event.id)) {
      addNotification(`You're already registered for "${event.title}"`, "info");
      return;
    }

    // Proceed with registration
    setEvents(prevEvents =>
      prevEvents.map(e =>
        e.id === event.id ? { ...e, attendees: (e.attendees || 0) + 1 } : e
      )
    );

    // Mark as registered
    setRegisteredEvents(prev => new Set(prev).add(event.id));

    // Show success message (auto-dismissed after 5s)
    const successData = {
      eventName: event.title,
      registrationTime: new Date().toLocaleTimeString(),
    };
    setRegistrationSuccess(successData);
    addNotification(`Registered for ${event.title}!`, 'success');

    // Auto-hide success banner after 5 seconds
    setTimeout(() => {
      setRegistrationSuccess(null);
    }, 5000); // 5000 millieseconds = 5 seconds
  };

  // 🔹 Add to cart
  const handleAddToCart = (event) => {
  setCart(prev => {
    if (Number(event.price) === 0) {
      // Free events should register instantly, not go to cart
      handleRegister(event);
      return prev; // don't add to cart
    }
    const existing = prev.find(item => item.id === event.id);
    if (existing) {
      return prev.map(item =>
        item.id === event.id ? { ...item, tickets: item.tickets + 1 } : item
      );
    }
    // Ensure price is a number
    return [...prev, { 
      ...event, 
      tickets: 1,
      price: Number(event.price) || 0 
    }];
  });
  addNotification(`Added "${event.title}" to cart`, 'success');
};

// Handle "Book Now" for paid events → go straight to checkout
const handleBookNowPaid = (event) => {
  // Ensure it's paid
  if (Number(event.price) === 0) {
    handleRegister(event);
    return;
  }

  // Add to cart (or increment if already there)
  setCart(prev => {
    const existing = prev.find(item => item.id === event.id);
    if (existing) {
      return prev.map(item =>
        item.id === event.id ? { ...item, tickets: item.tickets + 1 } : item
      );
    }
    return [...prev, { ...event, tickets: 1, price: Number(event.price) || 0 }];
  });

  // Immediately navigate to cart + reset any other state
  setCheckoutStep(0);
  setCurrentView("cart");
  setSelectedEvent(null);
  addNotification(`Added "${event.title}" to cart and proceeding to checkout`, 'success');
};

  // Update cart quantity
  const updateCart = (eventId, action) => {
    setCart(prevCart => 
      prevCart
        .map(item => 
          item.id === eventId 
            ? { ...item, tickets: action === 'add' ? item.tickets + 1 : Math.max(1, item.tickets - 1) }
            : item
        )
        .filter(item => item.tickets > 0)
    );
  };

  // Process checkout
  const processCheckout = () => {
    // 1. Validation
    if (!checkoutData.cardNumber?.trim()) {
      addNotification("Please enter your card details to proceed", "error");
      return;
    }

    // Capture current cart as order snapshot BEFORE clearing
    const orderSnapshot = [...cart];

    addNotification("Processing payment...", "success");
    setTimeout(() => {
      // 2. REGISTER ALL PAID EVENTS
      orderSnapshot.forEach(event => {
        setEvents(prevEvents =>
          prevEvents.map(e =>
            e.id === event.id ? { ...e, attendees: (e.attendees || 0) + (Number(event.tickets) || 1) } : e
          )
        );
        setRegisteredEvents(prev => new Set(prev).add(event.id));
        addNotification(`Registered for ${event.title}!`, 'success');
      });

      // 3. Clear cart & reset form
      setCart([]);
      setCheckoutData(prev => ({
        ...prev,
        cardNumber: '',
        expiry: '',
        cvv: ''
      }));

      // Save order snapshot for confirmation screen
      setConfirmedOrder(orderSnapshot);

      // 4. Show confirmation
      setCheckoutStep(3);
      addNotification("Payment Successful! Your tickets are ready.", "success");
      window.scrollTo(0, 0);
    }, 1500);
  };

  // Update checkout data
  const updateCheckoutData = (field, value) => {
    setCheckoutData(prev => ({ ...prev, [field]: value }));
  };

  const EventDetailPage = () => {
    if (!selectedEvent) return null;

    // ALWAYS fetch the latest event data from the live `events` state
    // This ensures attendee count updates immediately after registration
    const liveEvent = events.find(e => e.id === selectedEvent.id) || selectedEvent;

    // convert string/number values from DB to real numbers
    const isFree = Number(liveEvent.price) === 0;
    let attendees = Number(liveEvent.attendees) || 0;
    const capacity = Number(liveEvent.capacity) || 0;
    // Prevent negative values (e.g., if attendees > capacity due to race condition)
    const spotsLeft = Math.max(0, capacity - attendees);
    const isRegistered = registeredEvents.has(liveEvent.id); // Check registration status

    return (
      <div className="bg-gradient-to-r from-purple-800 via-fuchsia-800 to-purple-900 min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setSelectedEvent(null)}
            className="mb-6 flex items-center text-purple-200 hover:text-white"
          >
            <ChevronDown className="h-4 w-4 rotate-90 mr-1" />
            Back to events
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-700">
                <img
                  src={liveEvent.image_url || liveEvent.image}
                  alt={liveEvent.title}
                  className="w-full h-[400px] object-cover"
                />
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="inline-block bg-purple-900/50 text-purple-300 text-sm px-3 py-1 rounded-full mb-4">
                        {liveEvent.category}
                      </span>
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {liveEvent.title}
                      </h1>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-6 w-6 text-yellow-400 fill-current mr-2" />
                      <span className="text-xl font-bold text-white">{liveEvent.rating}</span>
                      <span className="ml-2 text-slate-400">({liveEvent.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-purple-400 mr-3" />
                      <div>
                        <div className="text-sm text-slate-400">Date</div>
                        <div className="font-medium text-white">
                          {new Date(liveEvent.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-purple-400 mr-3" />
                      <div>
                        <div className="text-sm text-slate-400">Time</div>
                        <div className="font-medium text-white">{liveEvent.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-purple-400 mr-3" />
                      <div>
                        <div className="text-sm text-slate-400">Location</div>
                        <div className="font-medium text-white">{liveEvent.location}</div>
                      </div>
                    </div>
                  </div>
                  {/* Success Banner: only shown if success matches THIS event */}
                  {registrationSuccess && registrationSuccess.eventName === selectedEvent.title && (
                    <div className="mb-6 bg-green-900/50 border border-green-500 rounded-xl p-4 flex items-start animate-in fade-in slide-in-from-top-4 duration-500">
                      <CheckCircle className="h-6 w-6 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-green-400 font-bold text-lg">
                          Successfully registered for "{registrationSuccess.eventName}" at {registrationSuccess.registrationTime}
                        </h3>
                        <p className="text-green-200/80">Check your email for confirmation details.</p>
                      </div>
                      <button 
                        onClick={() => setRegistrationSuccess(null)}
                        className="ml-auto text-green-400 hover:text-white"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
                    <p className="text-slate-300 leading-relaxed">{liveEvent.description}</p>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-white mb-3">What to Expect</h3>
                      <ul className="space-y-2 text-slate-300">
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Keynote presentations from industry leaders</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Interactive workshops and hands-on sessions</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Networking opportunities with professionals</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Access to exclusive resources and materials</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Organiser</h2>
                    <div className="flex items-center">
                      <div className="bg-slate-700 border-2 border-dashed rounded-xl w-16 h-16" />
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-white">{liveEvent.organizer}</h3>
                        <p className="text-slate-400">Verified Organizer • 15 events hosted</p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Venue</h2>
                    <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-white">{liveEvent.location}</p>
                          <p className="text-slate-400 mt-1">
                            Full address will be provided upon registration
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Event Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {liveEvent.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="bg-purple-900/40 text-purple-300 text-xs px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/* Right Column (Ticket/Action Panel) */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-2xl shadow-lg p-6 sticky top-8 border border-slate-700">
              <div className="text-center mb-6">
                <div className={`text-3xl font-bold ${isFree ? 'text-green-400' : 'text-blue-400'} mb-2`}>
                  {isFree ? 'Free' : `£${liveEvent.price}`}
                </div>
                <div className="text-slate-400">
                  {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
                </div>
              </div>

              {/* Progress bar with DYNAMIC labels */}
              <div className="mb-6">
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ 
                      width: capacity > 0 ? `${Math.min(100, (attendees / capacity) * 100).toFixed(1)}%` : '0%' 
                    }}
                  ></div>
                </div>
                {/* Show actual attendees / capacity */}
                <div className="flex justify-between text-sm text-slate-500 mt-1">
                  <span>{attendees}</span>
                  <span>{capacity}</span> {/* Was hardcoded to 100, now uses real capacity */}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {/* Disable button if already registered */}
                <button
                  onClick={() => {
                    if (isFree) {
                      handleRegister(liveEvent);
                      setSelectedEvent(null);
                    } else {
                      handleAddToCart(liveEvent);
                      setCurrentView('cart');
                      setCheckoutStep(0);
                      setSelectedEvent(null);
                    }
                  }}
                  disabled={isRegistered}
                  className={`w-full py-4 px-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg ${
                    isRegistered
                      ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white'
                  }`}
                >
                  {isRegistered
                    ? 'Already Registered'
                    : isFree
                      ? 'Register Now'
                      : 'Book Tickets'}
                </button>

                {!isFree && !isRegistered && (
                  <button
                    onClick={() => handleAddToCart(liveEvent)}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 border border-slate-600 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                )}
                  <button
                    onClick={() => {
                      setFavorites((prev) => {
                        const isFav = prev.includes(liveEvent.id);
                        return isFav
                          ? prev.filter((id) => id !== liveEvent.id)
                          : [...prev, liveEvent.id];
                      });
                      const message = favorites.includes(liveEvent.id)
                        ? `Removed "${liveEvent.title}" from favorites`
                        : `Added "${liveEvent.title}" to favorites`;
                      addNotification(message, favorites.includes(liveEvent.id) ? 'info' : 'success');
                    }}
                    className={`w-full flex items-center justify-center py-3 px-4 rounded-lg transition-colors border ${
                      favorites.includes(liveEvent.id)
                        ? 'bg-red-900/30 border-red-700 text-red-300'
                        : 'border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 mr-2 ${
                        favorites.includes(liveEvent.id)
                          ? 'fill-current text-red-400'
                          : 'text-slate-300'
                      }`}
                    />
                    {favorites.includes(liveEvent.id)
                      ? 'Added to Favorites'
                      : 'Add to Favorites'}
                  </button>
                  <button className="w-full flex items-center justify-center py-3 px-4 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors text-slate-300">
                    <Share2 className="h-5 w-5 mr-2" />
                    Share Event
                  </button>
                </div>
                <div className="pt-6 border-t border-slate-700">
                  <h3 className="font-semibold text-white mb-4">Event Policies</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>100% money-back guarantee if canceled 14 days before event</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Free transfers to another attendee</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Includes lunch and refreshments</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DashboardPage = ({ drafts = [], setDrafts, addNotification, setCurrentView }) => (
    <div className="bg-gradient-to-r  from-purple-800 via-fuchsia-800 to-purple-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-500">Welcome back, {user.name}!</h1>
          <p className="text-white mt-2">Manage your events, registrations, and preferences</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-200 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Completed Events</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Total Attendees</p>
                <p className="text-2xl font-bold text-white">247</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-white">4.7</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-xl shadow mb-8">
              <div className="px-6 py-4 border-b border-slate-950">
                <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
              </div>
              <div className="divide-y divide-slate-950">
                {events.slice(0, 2).map(event => (
                  <div key={event.id} className="p-6 hover:bg-gray-700">
                    <div className="flex">
                      <img src={event.image} alt={event.title} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-white">{event.title}</h3>
                          <span className="text-sm text-slate-400">{event.category}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-400 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{event.location}</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className={`text-lg font-bold ${event.price === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                            {event.price === 0 ? "Free" : `£${event.price}`}
                          </span>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => setSelectedEvent(event)} 
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              Details
                            </button>
                            <button 
                              onClick={() => {
                                setFavorites(prev => prev.includes(event.id)
                                  ? prev.filter(id => id !== event.id)
                                  : [...prev, event.id]
                                );
                              }} 
                              className="text-gray-500 hover:text-red-500"
                            >
                              <Heart className={`h-4 w-4 ${favorites.includes(event.id) ? 'fill-current text-red-500' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl shadow">
              <div className="px-6 py-4 border-b border-slate-950">
                <h2 className="text-xl font-bold text-white">Event History</h2>
              </div>
              <div className="divide-y divide-slate-950">
                {events.slice(2, 4).map(event => (
                  <div key={event.id} className="p-6 hover:bg-gray-700">
                    <div className="flex">
                      <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Calendar className="h-8 w-8 text-gray-500" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-white">{event.title}</h3>
                          <span className="text-sm text-slate-400">Completed</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-400 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className=" text-white flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="font-medium">{event.rating}</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                            View Certificate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Draft Events Section */}
            {drafts.length > 0 && (
              <div className="bg-slate-800 rounded-xl shadow mt-8">
                <div className="px-6 py-4 border-b border-slate-950">
                  <h2 className="text-xl font-bold text-white">Draft Events ({drafts.length})</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {drafts.map(d => (
                    <div key={d.id} className="p-6 hover:bg-gray-700">
                      <div className="flex items-start">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Edit3 className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-semibold text-white">
                              {d.title || 'Untitled Draft'}
                            </h3>
                              <span className="text-sm">
                                {events.date 
                                  ? new Date(events.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                                  : "Date TBD"}
                              </span>
                          </div>
                          <div className="mt-2 flex space-x-2">
                            <button
                              onClick={() => {
                                setDraftToEdit(d); // set the draft to edit
                                // pre-fill form and go to organize page
                                setCurrentView("organize");
                                // In a real app, I would pass `d` to pre-fill the form
                              }}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Resume Editing
                            </button>
                            <span className="text-xs text-slate-400">•</span>
                            <button
                              onClick={() => {
                                setDrafts(prev => prev.filter(draft => draft.id !== d.id));
                                addNotification(`Draft "${d.title || 'Untitled'}" deleted`, "info");
                              }}
                              className="text-sm text-slate-400 hover:text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>  
            )}
          </div>
          <div className="space-y-8">
            <div className="bg-slate-800 rounded-xl shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-white">Your Favorites</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {favorites.length === 0 ? (
                  <div className="p-6 text-center">
                    <Heart className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-gray-500">No favorites yet</p>
                    <p className="text-sm text-gray-400 mt-1">Click the ❤️ icon on events to save them</p>
                  </div>
                ) : (
                  favorites.slice(0, 3).map(favId => {
                    const event = events.find(e => e.id === favId);
                    if (!event) return null;
                    return (
                      <div key={favId} className="p-4 hover:bg-gray-700">
                        <div className="flex">
                          <img src={event.image} alt={event.title} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="ml-3">
                            <h4 className="font-medium text-white text-sm">{event.title}</h4>
                            <div className="flex items-center text-xs text-slate-400 mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                          </div>
                          <button onClick={() => {
                            setFavorites(prev => prev.filter(id => id !== favId));
                            addNotification(`Removed "${event.title}" from favorites`, "info");
                          }} className="ml-auto text-red-500 hover:text-red-700">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
                {favorites.length > 3 && (
                  <button className="w-full py-3 text-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                    View all {favorites.length} favorites
                  </button>
                )}
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-white">Quick Actions</h2>
              </div>
              <div className="text-white p-4 space-y-3">
                <button onClick={() => setCurrentView("organize")} className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Event
                </button>
                <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                  <Edit3 className="h-5 w-5 mr-2" />
                  Edit Profile
                </button>
                <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                  <Settings className="h-5 w-5 mr-2" />
                  Account Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // OrganiseEventPage with Multi-step Form

  const OrganizeEventPage = ({
    user,
    addNotification,
    setDrafts,
    drafts,
    setEvents,
    setCurrentView,
    draftToEdit,
    setDraftToEdit
  }) => {
    const [activeStep, setActiveStep] = useState(0); // 0: Event Details, 1: Location, 2: Venue, 3: Tickets, 4: Publish
    const [eventForm, setEventForm] = useState(() => {
      if (draftToEdit) {
        return {
          title: draftToEdit.title || '',
          category: draftToEdit.category || 'Technology',
          eventType: draftToEdit.eventType || 'Conference',
          description: draftToEdit.description || '',
          startDate: draftToEdit.startDate || '',
          startTime: draftToEdit.startTime || '',
          location: draftToEdit.location || '',
          venueName: draftToEdit.venueName || '',
          venueAddress: draftToEdit.venueAddress || '',
          venueCapacity: draftToEdit.venueCapacity || '',
          ticketPrice: draftToEdit.ticketPrice || 0,
          maxTickets: draftToEdit.maxTickets || 100,
          imageFile: null,
          imagePreview: draftToEdit.imagePreview || draftToEdit.image || null,
        };
      }
      return {
        title: '',
        category: 'Technology',
        eventType: 'Conference',
        description: '',
        startDate: '',
        startTime: '',
        location: '',
        venueName: '',
        venueAddress: '',
        venueCapacity: '',
        ticketPrice: 0,
        maxTickets: 100,
        imageFile: null,
        imagePreview: null,
      };
    });

    useEffect(() => {
      return () => {
        if (setDraftToEdit) setDraftToEdit(null);
      };
    }, [setDraftToEdit]);

    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        setEventForm(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: URL.createObjectURL(file)
        }));
      }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEventForm(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = () => {
      if (activeStep < 4) setActiveStep(activeStep + 1);
    };

    const handlePreviousStep = () => {
      if (activeStep > 0) setActiveStep(activeStep - 1);
    };

    const handleSaveDraft = () => {
      const now = new Date().toISOString();
      if (draftToEdit) {
        setDrafts(prev =>
          prev.map(d =>
            d.id === draftToEdit.id
              ? { ...d, ...eventForm, updatedAt: now }
              : d
          )
        );
        addNotification(`Draft "${eventForm.title || 'Untitled'}" updated!`, "success");
      } else {
        const newDraft = {
          ...eventForm,
          id: Date.now(),
          status: 'draft',
          createdAt: now,
          updatedAt: now
        };
        setDrafts(prev => [...prev, newDraft]);
        addNotification("Event draft saved successfully!", "success");
      }
    };

    const handlePublish = () => {
      if (!eventForm.title.trim()) {
        addNotification("Event title is required", "error");
        return;
      }
      if (!eventForm.startDate || !eventForm.startTime) {
        addNotification("Event date and time are required", "error");
        return;
      }
      if (!eventForm.venueName || !eventForm.venueAddress) {
        addNotification("Venue details are required", "error");
        return;
      }
      if (isNaN(eventForm.ticketPrice) || eventForm.ticketPrice < 0) {
        addNotification("Ticket price must be a valid number ≥ 0", "error");
        return;
      }
      if (!eventForm.venueCapacity || parseInt(eventForm.venueCapacity) <= 0) {
        addNotification("Valid venue capacity is required", "error");
        return;
      }

      const newEvent = {
        id: Date.now(),
        title: eventForm.title,
        date: eventForm.startDate,
        time: eventForm.startTime,
        location: eventForm.location || eventForm.venueAddress,
        category: eventForm.category,
        price: parseFloat(eventForm.ticketPrice) || 0,
        capacity: parseInt(eventForm.venueCapacity) || 100,
        attendees: 0,
        description: eventForm.description || "No description provided.",
        image: eventForm.imagePreview || `https://placehold.co/400x250/7e22ce/white?text=${encodeURIComponent(eventForm.title)}`,
        organizer: user.name,
        featured: false,
        rating: 0,
        reviews: 0,
        tags: [],
        eventType: eventForm.eventType,
      };

      setEvents(prev => [...prev, newEvent]);

      if (draftToEdit) {
        setDrafts(prev => prev.filter(d => d.id !== draftToEdit.id));
        addNotification(`Draft published and removed. Event "${newEvent.title}" is live!`, "success");
      } else {
        addNotification(`Event "${newEvent.title}" published successfully!`, "success");
      }

      setEventForm({
        title: '',
        category: 'Technology',
        eventType: 'Conference',
        description: '',
        startDate: '',
        startTime: '',
        location: '',
        venueName: '',
        venueAddress: '',
        venueCapacity: '',
        ticketPrice: 0,
        maxTickets: 100,
        imageFile: null,
        imagePreview: null,
      });
      setActiveStep(0);
      setDraftToEdit(null);
      setCurrentView("dashboard");
    };

    const renderStepContent = () => {
      switch (activeStep) {
        case 0:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={eventForm.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter event title"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={eventForm.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    {categories.filter(c => c !== "All").map(category => (
                      <option key={category} value={category} className="bg-slate-800">{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Event Type
                  </label>
                  <select
                    name="eventType"
                    value={eventForm.eventType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    {["Conference", "Workshop", "Seminar", "Webinar", "Networking", "Festival"].map(type => (
                      <option key={type} value={type} className="bg-slate-800">{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Event Description
                </label>
                <textarea
                  name="description"
                  value={eventForm.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Describe your event..."
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={eventForm.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={eventForm.startTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Event Image
                </label>
                <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center bg-slate-700/50">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer"
                  >
                    {eventForm.imagePreview ? (
                      <img
                        src={eventForm.imagePreview}
                        alt="Preview"
                        className="mx-auto h-32 w-auto object-contain rounded-lg"
                      />
                    ) : (
                      <>
                        <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                        <p className="mt-2 text-sm text-slate-400">
                          <span className="font-medium text-purple-400 hover:text-purple-300">
                            Upload a file
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        case 1:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Location (City/Region)
                </label>
                <input
                  type="text"
                  name="location"
                  value={eventForm.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
            </div>
          );
        case 2:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Venue Name *
                </label>
                <input
                  type="text"
                  name="venueName"
                  value={eventForm.venueName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter venue name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Venue Address *
                </label>
                <textarea
                  name="venueAddress"
                  value={eventForm.venueAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter full venue address"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Venue Capacity *
                </label>
                <input
                  type="number"
                  name="venueCapacity"
                  value={eventForm.venueCapacity}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., 200"
                />
              </div>
            </div>
          );
        case 3:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Ticket Price *
                </label>
                <div className="flex items-center">
                  <span className="text-slate-400 mr-2">$</span>
                  <input
                    type="number"
                    name="ticketPrice"
                    value={eventForm.ticketPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Enter 0 for free events
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Max Tickets (optional)
                </label>
                <input
                  type="number"
                  name="maxTickets"
                  value={eventForm.maxTickets}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="100"
                />
              </div>
            </div>
          );
        case 4:
          return (
            <div className="space-y-6">
              <div className="bg-purple-900/30 border border-purple-800 rounded-xl p-4">
                <h3 className="text-lg font-medium text-purple-300 mb-2">
                  Review Your Event
                </h3>
                <p className="text-purple-400 text-sm">
                  Please review all details. You can edit after publishing.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-300">Title</h4>
                  <p className="text-slate-400">{eventForm.title || "— Not set —"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-300">Date & Time</h4>
                  <p className="text-slate-400">
                    {eventForm.startDate
                      ? `${new Date(eventForm.startDate).toLocaleDateString()} at ${eventForm.startTime}`
                      : "— Not set —"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-300">Venue</h4>
                  <p className="text-slate-400">{eventForm.venueName || "— Not set —"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-300">Capacity</h4>
                  <p className="text-slate-400">{eventForm.venueCapacity || "— Not set —"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-300">Price</h4>
                  <p className="text-slate-400">${parseFloat(eventForm.ticketPrice).toFixed(2)}</p>
                </div>
              </div>
              {eventForm.imagePreview && (
                <div>
                  <h4 className="font-medium text-slate-300">Event Image</h4>
                  <img
                    src={eventForm.imagePreview}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-lg border border-slate-600"
                  />
                </div>
              )}
            </div>
          );
        default:
          return <div>Unknown Step</div>;
      }
    };

    return (
      <div className="bg-gradient-to-r from-purple-800 via-fuchsia-800 to-purple-900 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <button
              onClick={() => setCurrentView("dashboard")}
              className="mb-4 flex items-center text-purple-200 hover:text-white"
            >
              <ChevronDown className="h-4 w-4 rotate-90 mr-1" />
              Back to dashboard
            </button>
            <h1 className="text-3xl font-bold text-white">Create New Event</h1>
            <p className="text-purple-200 mt-2">
              Fill in the details to create your event
            </p>
          </div>
          <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
            <div className="border-b border-slate-700">
              <nav className="flex overflow-x-auto px-6 py-2 scrollbar-hide">
                {[
                  "Event Details",
                  "Location",
                  "Venue",
                  "Tickets",
                  "Publish",
                ].map((item, index) => (
                  <button
                    key={item}
                    onClick={() => setActiveStep(index)}
                    className={`whitespace-nowrap py-3 px-4 text-sm font-medium border-b-2 mx-1 ${
                      index === activeStep
                        ? "border-purple-500 text-purple-300"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </div>
            <div className="p-6">
              {renderStepContent()}
              <div className="flex flex-col sm:flex-row sm:justify-between pt-6 gap-4">
                <div className="flex space-x-3">
                  {activeStep > 0 && (
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-3 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 font-medium"
                    >
                      Previous
                    </button>
                  )}
                  {activeStep < 4 && (
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white rounded-lg font-medium shadow-md"
                    >
                      Next
                    </button>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveDraft}
                    className="px-6 py-3 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 font-medium"
                  >
                    Save Draft
                  </button>
                  {activeStep === 4 && (
                    <button
                      onClick={handlePublish}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium shadow-md"
                    >
                      Publish Event
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  
  const CartPage = () => (
    <div className="bg-gradient-to-r from-purple-800 via-fuchsia-800 to-purple-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => {
              setSelectedEvent(null);
              setCheckoutStep(0);
              setCurrentView("home");
            }}
            className="mb-4 flex items-center text-purple-200 hover:text-white"
          >
            <ChevronDown className="h-4 w-4 rotate-90 mr-1" />
            Back to events
          </button>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-slate-300 mt-2">Review your selections before checkout</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700">
              <div className="border-b border-slate-700 px-6 py-4">
                <h2 className="text-xl font-bold">Event Selections ({cart.length})</h2>
              </div>
              {cart.length === 0 ? (
                <div className="p-12 text-center">
                  <ShoppingCartIcon className="mx-auto h-16 w-16 text-slate-500" />
                  <h3 className="mt-4 text-xl font-medium">Your cart is empty</h3>
                  <p className="mt-2 text-slate-400">Browse events and add some to your cart</p>
                  <button
                    onClick={() => {
                      setCurrentView("home");
                      setCheckoutStep(0);
                    }}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white rounded-lg font-medium"
                  >
                    Browse Events
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-700">
                  {cart.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-semibold">{item.title}</h3>
                            <button
                              onClick={() => {
                                setCart((prev) => prev.filter((i) => i.id !== item.id));
                                addNotification(`Removed "${item.title}" from cart`, "info");
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="flex items-center text-sm text-slate-400 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              {new Date(item.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span className="mx-2">•</span>
                            <span>{item.category}</span>
                          </div>
                          <div className="mt-4 flex items-center">
                            <div className="flex items-center border border-slate-600 rounded-lg bg-slate-700">
                              <button
                                onClick={() => updateCart(item.id, "subtract")}
                                className="px-3 py-1 text-slate-300 hover:bg-slate-600"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 min-w-[2rem] text-center text-white">
                                {item.tickets}
                              </span>
                              <button
                                onClick={() => updateCart(item.id, "add")}
                                className="px-3 py-1 text-slate-300 hover:bg-slate-600"
                              >
                                +
                              </button>
                            </div>
                            <div className="ml-4 text-lg font-bold text-blue-400">
                              £{(item.price * item.tickets).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 text-slate-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">£{getSubtotal(cart).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee (2%)</span>
                    <span className="font-medium">£{getServiceFee(cart).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-700">
                    <span className="font-bold text-white">Total</span>
                    <span className="font-bold text-lg text-purple-300">
                      £{getTotal(cart).toFixed(2)}
                    </span>
                  </div>
                </div>
              {cart.length > 0 && (
                <button
                  onClick={() => setCheckoutStep(1)}
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white py-4 px-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg"
                >
                  Proceed to Checkout
                </button>
              )}
            </div>
            <div className="bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-700">
              <h3 className="font-semibold mb-3">Need Help?</h3>
              <p className="text-slate-400 text-sm mb-3">
                Contact our support team for assistance with your registration.
              </p>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-blue-400 mr-2" />
                  <span>support@eventpro.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-blue-400 mr-2" />
                  <span>+1 (800) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  const Footer = () => (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">EventPro</span>
            </div>
            <p className="mt-4 text-gray-400 max-w-md">
              The premier platform for discovering, organizing, and attending events worldwide. 
              Connecting people through shared experiences since 2020.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <button onClick={() => scrollToSection(aboutRef)} className="text-gray-400 hover:text-white text-left w-full text-start">
                  About Us
                </button>
              </li>
              <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              <li>
                <button onClick={() => scrollToSection(contactRef)} className="text-gray-400 hover:text-white text-left w-full text-start">
                  Contact
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Event Guidelines</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Safety Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Community</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Partners</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Accessibility</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">GDPR</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 EventPro. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm">Security</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Status</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Site Map</a>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        events={events}
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        setCheckoutStep={setCheckoutStep}
        notifications={notifications}
        setNotificationOpen={setNotificationOpen}
        notificationOpen={notificationOpen}
        favorites={favorites}
        setFavorites={setFavorites} 
        setFavoritesOpen={setFavoritesOpen}
        favoritesOpen={favoritesOpen}
        cart={cart}
        setCart={setCart}   
        setCartOpen={setCartOpen}
        cartOpen={cartOpen}
        user={user}
        aboutRef={aboutRef}
        contactRef={contactRef}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        addNotification={addNotification}
      />
    <main className="flex-grow">
      {currentView === "home" && !selectedEvent && checkoutStep === 0 && (
        <HomePage
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          categories={categories}
          priceFilters={priceFilters}
          filteredEvents={filteredEvents}
          events={events}
          favorites={favorites}
          setFavorites={setFavorites}
          addNotification={addNotification}
          handleRegister={handleRegister}
          handleAddToCart={handleAddToCart}
          //handleBookNowPaid={handleBookNowPaid}
          setSelectedEvent={setSelectedEvent}
          registrationSuccess={registrationSuccess}
          setRegistrationSuccess={setRegistrationSuccess}
          aboutRef={aboutRef}
          contactRef={contactRef}
          searchInputRef={searchInputRef}
          setCurrentView={setCurrentView}
          setCheckoutStep={setCheckoutStep}
        />
      )}

      {currentView === "cart" && checkoutStep === 0 && <CartPage />}
      
      {currentView === "cart" && cart.length === 0 && (
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <ShoppingCartIcon className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-600">Add events to your cart to see them here.</p>
          <button
            onClick={() => setCurrentView("home")}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Browse Events
          </button>
        </div>
      )}

      {selectedEvent && checkoutStep === 0 && <EventDetailPage />}
      {currentView === "dashboard" && checkoutStep === 0 && (
        <DashboardPage 
          drafts={drafts} 
          setDrafts={setDrafts} 
          addNotification={addNotification}
          setCurrentView={setCurrentView}
        />
      )}
      {currentView === "organize" && checkoutStep === 0 && (
        <OrganizeEventPage 
          user={user}
          addNotification={addNotification}
          setDrafts={setDrafts}
          drafts={drafts}
          setEvents={setEvents}
          setCurrentView={setCurrentView}
          draftToEdit={draftToEdit}
          setDraftToEdit={setDraftToEdit} 
        />
      )}
      {checkoutStep === 1 && (
        <CheckoutDetails
          checkoutData={checkoutData}
          updateCheckoutData={updateCheckoutData}
          setCheckoutStep={setCheckoutStep}
        />
      )}
      {checkoutStep === 2 && (
        <CheckoutPayment
          cart={cart}
          checkoutData={checkoutData}
          updateCheckoutData={updateCheckoutData}
          setCheckoutStep={setCheckoutStep}
          processCheckout={processCheckout}
        />
      )}
      {checkoutStep === 3 && (
        <CheckoutConfirmation
          cart={confirmedOrder}
          checkoutData={checkoutData}
          setCheckoutStep={setCheckoutStep}
          setCart={setCart}
          setCurrentView={setCurrentView}
        />
      )}
    </main>
      <Footer />
    </div>
  );
};

export default App;
