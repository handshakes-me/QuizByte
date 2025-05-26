"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaUserPlus, FaSignInAlt, FaUserGraduate, FaBook } from "react-icons/fa";

const Page = () => {
  const cards = [
    {
      title: "Sign Up",
      description:
        "Join QuizByte to start taking online examinations and access a robust exam management system designed for secure, comprehensive assessments.",
      link: "/signup",
      icon: <FaUserPlus size={48} className="text-blue-600 mb-4" />,
    },
    {
      title: "Login",
      description:
        "Log into your QuizByte account to take your scheduled exams, review results, and manage your online assessments seamlessly.",
      link: "/login",
      icon: <FaSignInAlt size={48} className="text-blue-600 mb-4" />,
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Layers with Sliding Gradient Effect */}
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>

      {/* Floating Icons (Optional) */}
      <motion.div
        initial={{ opacity: 0, x: -50, y: -30 }}
        animate={{ opacity: 0.3, x: 50, y: 30 }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="absolute top-10 left-10"
      >
        <FaUserGraduate size={60} className="text-white" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50, y: 30 }}
        animate={{ opacity: 0.3, x: -50, y: -30 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="absolute bottom-10 right-10"
      >
        <FaBook size={70} className="text-white" />
      </motion.div>

      {/* Project Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">QuizByte</h1>
        <p className="mt-4 text-2xl text-white drop-shadow-lg">
          Your Premier Online Examination System
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-300 rounded-lg shadow-md p-8 flex flex-col justify-between transition duration-200"
          >
            <div className="flex flex-col items-center">
              {card.icon}
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{card.title}</h2>
              <p className="text-gray-600 text-center mb-6">{card.description}</p>
            </div>
            <Link
              href={card.link}
              className="inline-block w-full text-center px-6 py-3 border border-blue-600 text-blue-600 rounded hover:bg-purple-600 hover:text-white transition duration-200 text-lg font-medium"
            >
              {card.title}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Global CSS for Background Animation */}
      <style jsx global>{`
        .bg {
    animation: slide 7s ease-in-out infinite alternate;
    background-image: linear-gradient(-60deg, #0099ff 50%, #9400a7 50%);
    bottom: 0;
    left: -50%;
    opacity: 0.5;
    position: fixed;
    right: -50%;
    top: 0;
    z-index: -1;
  }
  .bg2 {
    animation-direction: alternate-reverse;
    animation-duration: 9s;
  }
  .bg3 {
    animation-duration: 12s;
  }
  @keyframes slide {
    0% {
      transform: translateX(-25%);
    }
    100% {
      transform: translateX(25%);
    }
  }
      `}</style>
    </div>
  );
};

export default Page;
