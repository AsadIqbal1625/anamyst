import { FaInstagram }
from "react-icons/fa";
import Link from "next/link";
import BrandWordmark from "./BrandWordmark";

import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {

  return (

    <footer className="bg-black border-t border-gold/20 text-white">

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>

            <h2 className="mb-5">

              <BrandWordmark className="h-7 w-auto" />

            </h2>

            <p className="text-gray-400 leading-8 text-sm">

              Premium luxury fragrances
              crafted for elegance,
              sophistication, and timeless identity.

            </p>

          </div>

          {/* SHOP */}
          <div>

            <h3 className="text-gold text-lg font-semibold mb-5">

              Shop

            </h3>

            <div className="flex flex-col gap-4 text-gray-300 text-sm">

              <Link
                href="/shop"
                className="hover:text-gold transition"
              >

                All Products

              </Link>

              <Link
                href="/cart"
                className="hover:text-gold transition"
              >

                Cart

              </Link>

              <Link
                href="/faq"
                className="hover:text-gold transition"
              >

                FAQ

              </Link>
              <Link
                href="/track-order"
                className="hover:text-gold transition"
              >
                Track Order
              </Link>

              <Link
                href="/notices"
                className="hover:text-gold transition"
              >
                New Launches
              </Link>

              <Link
                href="/contact"
                className="hover:text-gold transition"
              >

                Contact

              </Link>

            </div>

          </div>

          {/* POLICIES */}
          <div>

            <h3 className="text-gold text-lg font-semibold mb-5">

              Policies

            </h3>

            <div className="flex flex-col gap-4 text-gray-300 text-sm">

              <Link
                href="/privacy-policy"
                className="hover:text-gold transition"
              >

                Privacy Policy

              </Link>

              <Link
                href="/refund-policy"
                className="hover:text-gold transition"
              >

                Refund Policy

              </Link>

              <Link
                href="/shipping-policy"
                className="hover:text-gold transition"
              >

                Shipping Policy

              </Link>

              <Link
                href="/terms-and-conditions"
                className="hover:text-gold transition"
              >

                Terms & Conditions

              </Link>

            </div>

          </div>

          {/* CONTACT */}
          <div>

            <h3 className="text-gold text-lg font-semibold mb-5">

              Connect

            </h3>

            <div className="space-y-5 text-sm text-gray-300">

              {/* EMAIL */}
              <div className="flex items-center gap-3">

                <Mail
                  size={18}
                  className="text-gold"
                />

                <span>

                  team@anamyst.com

                </span>

              </div>

              {/* PHONE */}
              <div className="flex items-center gap-3">

                <Phone
                  size={18}
                  className="text-gold"
                />

                <span>

                  +91 8840305018

                </span>

              </div>

              {/* ADDRESS */}
              <div className="flex items-start gap-3">

                <MapPin
                  size={18}
                  className="text-gold mt-1"
                />

                <span>

                  Lucknow,
                  Uttar Pradesh,
                  India

                </span>

              </div>

              {/* INSTAGRAM */}
              <a
                href="https://instagram.com/anamyst_official"
                target="_blank"
                className="flex items-center gap-3 hover:text-gold transition"
              >
             <FaInstagram
                className="text-gold"
                size={18}
              />

                <span>

                  anamyst_official

                </span>

              </a>

            </div>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-5 text-sm text-gray-500">

          <p>

            © 2026 ANAMYST.
            All rights reserved.

          </p>

          <p>

            Crafted with luxury & elegance.

          </p>

        </div>

      </div>

    </footer>

  );

}