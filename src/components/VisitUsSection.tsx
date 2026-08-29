import React from 'react';
import { MapPin, Phone, Mail, Navigation } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const VisitUsSection: React.FC = () => {
  const { settings } = useStore();

  const exactMapQuery = encodeURIComponent('Shri Laxmi Sweet Mart, Shop No. 1, Near KTC Bus Stand, Main Road, Mapusa, Goa 403507');
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${exactMapQuery}`;
  const iframeEmbedUrl = `https://maps.google.com/maps?q=${exactMapQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="visit" className="py-10 sm:py-16 bg-[#F8F3EA] border-b border-[#E9DED0] text-left scroll-mt-16 sm:scroll-mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Minimal Section Header */}
        <div className="mb-6">
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#6E1824] block mb-0.5">
            Location & Contact
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#241A17]">
            Visit Us in Mapusa
          </h2>
        </div>

        {/* Professional Location + Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Clean & Minimal Store Details */}
          <div className="lg:col-span-5 bg-[#FFFDF8] border border-[#E9DED0] rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-5">
            
            <div className="space-y-4">
              
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#F8F3EA] text-[#6E1824] border border-[#E9DED0] flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#6E1824] uppercase tracking-wider">
                    Shop Address
                  </h4>
                  <p className="text-xs sm:text-sm text-[#241A17] font-semibold mt-0.5 leading-relaxed">
                    {settings.address}
                  </p>
                  <p className="text-[11px] text-[#6E1824] font-medium mt-0.5">
                    Landmark: Directly beside the Mapusa KTC Bus Stand terminal.
                  </p>
                </div>
              </div>

              {/* Contact: Phone & Email */}
              <div className="pt-3 border-t border-[#E9DED0] space-y-3">
                
                {/* Mobile Phone */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#F8F3EA] text-[#6E1824] border border-[#E9DED0] flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-[#6E1824] uppercase tracking-wider">
                      Mobile / Counter Call
                    </h4>
                    <a
                      href="tel:09423313875"
                      className="inline-block mt-0.5 text-xs sm:text-sm font-bold text-[#6E1824] hover:underline"
                    >
                      094233 13875
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#F8F3EA] text-[#6E1824] border border-[#E9DED0] flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-[#6E1824] uppercase tracking-wider">
                      Email for Queries
                    </h4>
                    <a
                      href="mailto:laxmisweetmart@gmail.com"
                      className="inline-block mt-0.5 text-xs sm:text-sm font-bold text-[#241A17] hover:text-[#6E1824] transition-colors"
                    >
                      laxmisweetmart@gmail.com
                    </a>
                  </div>
                </div>

              </div>

            </div>

            {/* Directions Action */}
            <div className="pt-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-5 rounded-2xl font-bold bg-[#6E1824] hover:bg-[#52111A] text-[#FFFDF8] text-xs shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
              >
                <Navigation className="w-4 h-4 text-[#C89B3C]" />
                <span>Get Directions on Google Maps</span>
              </a>
            </div>

          </div>

          {/* Right Column: Google Maps Embed with Exact Location Query & Clean Controls */}
          <div className="lg:col-span-7">
            <div className="h-full min-h-[300px] rounded-3xl overflow-hidden border border-[#E9DED0] shadow-sm relative bg-[#FFFDF8]">
              <iframe
                title="Shri Laxmi Sweet Mart Mapusa Location"
                src={iframeEmbedUrl}
                className="w-full h-[calc(100%+32px)] -mb-8 min-h-[320px] border-0"
                loading="lazy"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
