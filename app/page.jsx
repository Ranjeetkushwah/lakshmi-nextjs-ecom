"use client";
import { motion } from "framer-motion";
import Link from "next/link";

import React from 'react'

const page = () => {
  return (<>
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">

      {/* Animated floating circles */}
      <div className="absolute inset-0">
        <div className="absolute w-48 h-48 bg-pink-400 rounded-full opacity-30 blur-3xl top-10 left-10 animate-pulse"></div>
        <div className="absolute w-72 h-72 bg-purple-400 rounded-full opacity-30 blur-3xl bottom-10 right-10 animate-bounce"></div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 text-center space-y-6"
      >
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">
          Welcome to <span className="text-yellow-300">Yogesh E-Com</span>
        </h1>
        <p className="text-lg text-gray-200 max-w-xl mx-auto">
          Discover the best shopping experience — fast, stylish, and simple.
        </p>

        <div className="flex justify-center gap-6 mt-8">
          <Link href="/auth/login">
            <button className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl shadow-md hover:scale-105 transition-transform">
              Login
            </button>
          </Link>

          <Link href="/auth/register">
            <button className="px-6 py-3 bg-yellow-400 text-indigo-900 font-semibold rounded-xl shadow-md hover:scale-105 transition-transform">
              Register
            </button>
          </Link>
        </div>
      </motion.div>
    </main>
  </>
  )
}

export default page