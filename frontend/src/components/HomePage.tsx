import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Car,
  ShieldCheck,
  MapPin,
  Clock,
  Instagram,
  Send,
  MessageCircle,
  ChevronRight,
  Star
} from "lucide-react";
import FAQSection from "./FAQSection";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const HomePage = () => {
  return (
    <div className="relative text-white bg-black overflow-hidden">
      
      <div className="absolute z-0">
        <div className="absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-blue-900 opacity-60" />
        <div className="absolute top-[5%] left-[10%] w-80 h-80 bg-blue-600 rounded-full opacity-10 blur-3xl animate-pulse" />
        <div className="absolute top-[25%] right-[15%] w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-[20%] left-[20%] w-64 h-64 bg-blue-700 rounded-full opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-72 h-72 bg-blue-400 rounded-full opacity-5 blur-3xl animate-pulse" />
      </div>

      <nav className="relative z-10 bg-black bg-opacity-90 border-b border-blue-900">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-wide text-blue-500 hover:text-blue-400 transition-all"
          >
            <span className="text-white">Qazaq</span>Rental
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/cars"
              className="hover:text-blue-400 transition-colors duration-200"
            >
              Cars
            </Link>
         
            <Link
              to="/about"
              className="hover:text-blue-400 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/locations"
              className="hover:text-blue-400 transition-colors duration-200"
            >
              Locations
            </Link>
            <Link
              to="/login"
              className="hover:text-black hover:bg-blue-400 border border-blue-500 text-blue-500 py-2 px-5 rounded transition-colors duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-5 rounded shadow-lg shadow-blue-900/30 transition-all duration-300 hover:shadow-blue-500/30"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>


      

     
      <header className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            src="/videos/video.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-blue-900/40" />
          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-2xl"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1 }}
          >
            NEXT LEVEL <span className="text-blue-500">CAR RENTAL</span> EXPERIENCE
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-300 drop-shadow"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1, delay: 0.2 }}
          >
            Your premium car rental service in Kazakhstan. Unmatched selection, unparalleled service.
          </motion.p>
          <motion.div
            className="space-x-6"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1, delay: 0.4 }}
          >
            <Link
              to="/cars"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white py-4 px-8 rounded-md font-medium text-lg shadow-xl shadow-blue-900/30 transition-all transform hover:scale-105 hover:shadow-blue-500/30"
            >
              View Fleet
            </Link>
            <Link
              to="/register"
              className="inline-block bg-transparent border-2 border-blue-500 text-blue-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 py-4 px-8 rounded-md font-medium text-lg shadow-xl shadow-blue-900/10 transition-all transform hover:scale-105"
            >
              Join Now
            </Link>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent"></div>
      </header>

      
      <section className="py-20 bg-gradient-to-b from-black to-blue-950 relative z-10">
        <div className="container mx-auto text-center px-6">
          <motion.h2
            className="text-4xl font-bold mb-16 text-white"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            Why <span className="text-blue-500">Choose</span> Us?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Car,
                title: "Premium Fleet",
                description:
                  "From executive sedans to luxury SUVs, only top-tier vehicles in our collection.",
              },
              {
                icon: ShieldCheck,
                title: "Maximum Security",
                description:
                  "Comprehensive insurance and 24/7 roadside assistance for complete peace of mind.",
              },
              {
                icon: MapPin,
                title: "Nationwide Network",
                description:
                  "Conveniently located pickup points across all Kazakhstan's major cities.",
              },
              {
                icon: Clock,
                title: "Streamlined Process",
                description: "Book in minutes and hit the road with minimal paperwork.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center bg-blue-950/50 p-8 rounded-lg shadow-xl border border-blue-900/50
                           hover:border-blue-600/50 transition-all duration-300 group"
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mb-5 group-hover:bg-blue-800/70 transition-all duration-300">
                  <item.icon className="w-8 h-8 text-blue-400 drop-shadow" />
                </div>
                <h3 className="mt-2 font-bold text-xl text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-black relative z-10">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl font-bold mb-4 text-white"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-blue-500">Premium</span> Selection
          </motion.h2>
          <motion.p
            className="text-gray-400 max-w-2xl mx-auto mb-16"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Experience luxury and performance with our carefully curated collection of vehicles
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "BMW X5",
                description: "Luxury SUV with cutting-edge features",
                price: "35,000 ₸",
                image: "/images/bmw.jpg",
              },
              {
                name: "Mercedes S-Class",
                description: "Ultimate comfort and sophistication",
                price: "42,000 ₸",
                image: "/images/mercedes.jpg",
              },
              {
                name: "Audi Q7",
                description: "Power, elegance and advanced technology",
                price: "38,000 ₸",
                image: "/images/audi.jpg",
              },
            ].map((car, idx) => (
              <motion.div
                key={idx}
                className="bg-blue-950/30 rounded-lg shadow-lg overflow-hidden border border-blue-900/50 hover:border-blue-600/50 transition-all duration-300"
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="relative">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-0 right-0 bg-blue-600 text-white py-1 px-4 rounded-bl-lg font-bold">
                    {car.price}/day
                  </div>
                </div>
                <div className="p-6 text-left">
                  <h3 className="text-xl font-bold text-white mb-2">{car.name}</h3>
                  <p className="text-gray-400 mb-4">{car.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-blue-500 fill-blue-500" />
                      ))}
                    </div>
                    <Link
                      to={`/about/`}
                      className="flex items-center text-blue-400 font-medium hover:text-blue-300 transition-colors"
                    >
                      Details <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12">
            <Link
              to="/cars"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white py-3 px-8 rounded-md font-medium shadow-lg shadow-blue-900/30 transition-all transform hover:scale-105"
            >
              View All Vehicles
            </Link>
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-gradient-to-b from-blue-950 to-black text-center relative z-10">
        <h2 className="text-4xl font-bold mb-4 text-white">
          <span className="text-blue-500">Fleet</span> Categories
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-16">
          Whatever your journey requires, we have the perfect vehicle to match
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
          {[
            {
              title: "Executive",
              image: "/images/mercedes.jpg",
              desc: "Luxury sedans for professional travel.",
            },
            {
              title: "SUV & Crossover",
              image: "/images/suv-category.jpg",
              desc: "Versatility for any terrain or adventure.",
            },
            {
              title: "Econom",
              image: "/images/economy-category.jpg",
              desc: "High-performance vehicles for the thrill-seekers.",
            },
            {
              title: "Premium",
              image: "/images/minivan-category.jpg",
              desc: "Top-tier luxury vehicles for special occasions.",
            },
          ].map((cat, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-1">{cat.title}</h3>
                <p className="text-gray-300 text-sm transform translate-y-0 opacity-100 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  {cat.desc}
                </p>
                <Link
                  to={`/locations/`}
                  className="inline-block mt-3 text-blue-400 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                >
                  Browse Category →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-20 bg-black text-center relative z-10">
        <div className="absolute left-0 top-0 w-full h-full overflow-hidden opacity-5">
          <div className="absolute top-0 w-[800px] h-[800px] bg-blue-500 rounded-full blur-3xl opacity-30 transform -translate-x-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-700 rounded-full blur-3xl opacity-30 transform translate-x-1/3"></div>
        </div>
        
        <div className="container mx-auto px-6 relative">
          <h2 className="text-4xl font-bold mb-4 text-white">
            <span className="text-blue-500">Exclusive</span> Offers
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-16">
            Take advantage of our limited-time special deals and promotions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Weekend Escape",
                image: "/images/offer1.jpg",
                desc: "30% off on all weekend rentals. Perfect for short getaways.",
                discount: "30% OFF",
              },
              {
                title: "Business Package",
                image: "/images/offer2.jpg",
                desc: "Special rates for corporate clients with added premium services.",
                discount: "PREMIUM",
              },
              {
                title: "Extended Journey",
                image: "/images/offer3.jpg",
                desc: "Rent for 7+ days and enjoy significant discounts plus free upgrades.",
                discount: "20% OFF",
              },
            ].map((offer, i) => (
              <div
                key={i}
                className="bg-blue-950/30 rounded-lg overflow-hidden border border-blue-900/50 hover:border-blue-600/50 transition-all duration-300 shadow-lg group"
              >
                <div className="relative">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white py-1 px-4 rounded-md font-bold text-sm">
                    {offer.discount}
                  </div>
                </div>
                <div className="p-6 text-left">
                  <h3 className="text-xl font-bold text-white mb-2">{offer.title}</h3>
                  <p className="text-gray-400 mb-4">{offer.desc}</p>
                 
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-blue-950 to-black text-center relative z-10">
        <h2 className="text-4xl font-bold mb-4 text-white">
          <span className="text-blue-500">Streamlined</span> Process
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-16">
          Rent your dream car in just a few simple steps
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 max-w-5xl mx-auto px-6">
          {[
            {
              step: "01",
              title: "Choose Your Vehicle",
              desc: "Browse our extensive fleet and select the perfect car for your needs.",
              icon: Car,
            },
            {
              step: "02",
              title: "Book Online",
              desc: "Complete your reservation with our secure, hassle-free booking system.",
              icon: Clock,
            },
            {
              step: "03",
              title: "Pickup Location",
              desc: "Select a convenient pickup point from our nationwide network.",
              icon: MapPin,
            },
            {
              step: "04",
              title: "Enjoy Your Journey",
              desc: "Get behind the wheel and experience the road with confidence.",
              icon: ShieldCheck,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group relative"
            >
              <div className="bg-blue-950/30 p-8 rounded-lg shadow-lg border border-blue-900/50 h-full hover:border-blue-600/50 transition-all duration-300 flex flex-col items-center">
                <div className="text-blue-500 font-bold text-2xl mb-6">{item.step}</div>
                <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mb-5 group-hover:bg-blue-700 transition-all duration-300">
                  <item.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
              {idx < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-5 transform -translate-y-1/2 z-10">
                  <ChevronRight className="w-10 h-10 text-blue-500/30" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Link
            to="/register"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white py-3 px-8 rounded-md font-medium shadow-lg shadow-blue-900/30 transition-all transform hover:scale-105"
          >
            Book Now
          </Link>
        </div>
      </section>

      
      <section className="py-20 bg-black text-center relative z-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-0 right-0 top-0 h-40 bg-gradient-to-b from-blue-900/10 to-transparent"></div>
        </div>
        <div className="container mx-auto px-6 relative">
          <motion.h2
            className="text-4xl font-bold mb-4 text-white"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-blue-500">Client</span> Testimonials
          </motion.h2>
          <motion.p
            className="text-gray-400 max-w-2xl mx-auto mb-16"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Hear what our clients have to say about their experiences
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Aidos T.",
                position: "Business Executive",
                review:
                  "The service exceeded all my expectations. The vehicle was immaculate and performed flawlessly throughout my business trip.",
                avatar: "/images/user1.jpg",
              },
              {
                name: "Dana K.",
                position: "Travel Blogger",
                review:
                  "QazaqRental has been my go-to for years. Their premium fleet and outstanding service make every journey memorable.",
                avatar: "/images/user2.png",
              },
              {
                name: "Ruslan Z.",
                position: "Corporate Client",
                review:
                  "The team went above and beyond to accommodate our company's transportation needs. Truly exceptional service.",
                avatar: "/images/user2.jpg",
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                className="bg-blue-950/30 p-8 rounded-lg shadow-lg border border-blue-900/50 hover:border-blue-600/50 transition-all duration-300"
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-blue-500 fill-blue-500 inline-block mr-1" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 text-left italic">"{testimonial.review}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div className="ml-4 text-left">
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-blue-400 text-sm">{testimonial.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="relative z-10">
        <FAQSection />
      </div>

      {/* Footer */}
      <footer className="bg-blue-950 py-12 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-6">QazaqRental</h3>
              <p className="text-gray-400 mb-6">
                Setting new standards in premium car rental services across Kazakhstan.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com/ualikhaanuly"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-900 hover:bg-blue-800 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://t.me/bergty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-900 hover:bg-blue-800 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                >
                  <Send className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://wa.me/87716252863"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-900 hover:bg-blue-800 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/cars" className="hover:text-blue-400 transition-colors">Our Fleet</Link></li>
                <li><Link to="/offers" className="hover:text-blue-400 transition-colors">Special Offers</Link></li>
                <li><Link to="/locations" className="hover:text-blue-400 transition-colors">Locations</Link></li>
                <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
                <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Contact</h3>
              <ul className="space-y-3 text-gray-400">
                <li>Islam Karimova 70</li>
                <li>+7 (771) 625-2863</li>
                <li>ualihanulybeknur@gmail.com</li>
                <li>24/7 Customer Support</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-blue-900/50 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} QazaqRental. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <img src="/images/payment-methods.png" alt="Payment Methods" className="h-8" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;