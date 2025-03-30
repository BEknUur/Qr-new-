
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Award,
  MapPin,
  Car
} from "lucide-react";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const About = () => {
  return (
    <div className="relative text-white bg-black overflow-hidden">
    
      <div className="absolute z-0">
        <div className="absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-blue-900 opacity-60" />
        <div className="absolute top-[5%] left-[10%] w-80 h-80 bg-blue-600 rounded-full opacity-10 blur-3xl animate-pulse" />
        <div className="absolute top-[25%] right-[15%] w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-[20%] left-[20%] w-64 h-64 bg-blue-700 rounded-full opacity-10 blur-3xl animate-pulse" />
      </div>

    
      <header className="relative pt-20 pb-32 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
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
            About <span className="text-blue-500">QazaqRental</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-300 drop-shadow"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1, delay: 0.2 }}
          >
            Redefining the car rental experience in Kazakhstan
          </motion.p>
        </div>
      </header>

     
      <section className="py-20 bg-blue-950/20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                Our <span className="text-blue-500">Story</span>
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Founded in December 2024 by Beknur Ualikhanuly, QazaqRental was born from a vision to transform the car rental landscape in Kazakhstan. What began as a passionate entrepreneurial journey has quickly evolved into one of the country's most promising premium car rental services.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Drawing from personal experiences and recognizing the gap in the market for truly exceptional service, Beknur set out to build a company that prioritizes quality, reliability, and customer satisfaction above all else.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Today, QazaqRental stands as a testament to Kazakh entrepreneurship and innovation, offering an unmatched selection of premium vehicles and setting new standards in the industry.
              </p>
            </motion.div>
            <motion.div
              className="relative"
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl shadow-blue-900/30">
                <img 
                  src="/images/beknur.jpg" 
                  alt="Beknur Ualikhanuly, Founder of QazaqRental" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-black relative z-10">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl font-bold mb-16 text-center"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            Our <span className="text-blue-500">Impact</span> in Numbers
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Calendar,
                number: "2024",
                text: "Year Founded",
              },
              {
                icon: Users,
                number: "1,000+",
                text: "Registered Users Goal",
              },
              {
                icon: Car,
                number: "150+",
                text: "Premium Vehicles",
              },
              {
                icon: MapPin,
                number: "12",
                text: "Cities Serviced",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-blue-950/30 p-8 rounded-lg text-center border border-blue-900/50 hover:border-blue-600/50 transition-all duration-300"
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mb-5 mx-auto">
                  <item.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{item.number}</h3>
                <p className="text-gray-400">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-gradient-to-b from-blue-950/20 to-black relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div
              className="bg-blue-950/30 p-8 rounded-lg border border-blue-900/50"
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold mb-6">
                Our <span className="text-blue-500">Mission</span>
              </h3>
              <p className="text-gray-300 leading-relaxed">
                To revolutionize the car rental experience in Kazakhstan by providing unparalleled service, a premium fleet of vehicles, and seamless customer journeys, ensuring that every client enjoys exceptional value and memorable experiences on the road.
              </p>
            </motion.div>

            <motion.div
              className="bg-blue-950/30 p-8 rounded-lg border border-blue-900/50"
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-6">
                Our <span className="text-blue-500">Vision</span>
              </h3>
              <p className="text-gray-300 leading-relaxed">
                To become Kazakhstan's leading premium car rental service, recognized for our commitment to excellence, innovation, and customer satisfaction. We aim to expand our services nationwide while maintaining the highest standards of quality and reliability.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-black relative z-10">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl font-bold mb-16 text-center"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            Our <span className="text-blue-500">Core</span> Values
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Excellence",
                description: "We strive for excellence in every aspect of our service, from the quality of our vehicles to the professionalism of our staff.",
              },
              {
                icon: Users,
                title: "Customer-Centric",
                description: "Our customers are at the heart of everything we do. We prioritize their needs, preferences, and satisfaction above all else.",
              },
              {
                icon: Car,
                title: "Innovation",
                description: "We continuously seek innovative ways to enhance our services, streamline processes, and exceed customer expectations.",
              },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                className="bg-blue-950/30 p-8 rounded-lg border border-blue-900/50 hover:border-blue-600/50 transition-all duration-300"
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mb-5">
                  <value.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-gradient-to-b from-blue-950 to-black text-center relative z-10">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl font-bold mb-6 text-white"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            Join Our <span className="text-blue-500">Journey</span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-10"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Experience the QazaqRental difference today and be part of our growing community
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to="/cars"
              className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-8 rounded-md font-medium shadow-lg shadow-blue-900/30 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              <Car className="w-5 h-5 mr-2" /> View Our Fleet
            </Link>
            <Link
              to="/register"
              className="bg-transparent border-2 border-blue-500 text-blue-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 py-3 px-8 rounded-md font-medium transition-all transform hover:scale-105 flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-2" /> Join Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;