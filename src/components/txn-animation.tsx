import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface TxnAnimationProps {
  size?: number;
  showSuccess?: boolean;
  loading?: boolean;
  bgColor?: string;
}

const TxnAnimation: React.FC<TxnAnimationProps> = ({
  size = 262,
  showSuccess = false,
  loading = false,
  bgColor = "#000d1e",
}) => {
  const [animateSuccess, setAnimateSuccess] = useState(false);
  const [animateLoading, setAnimateLoading] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      setAnimateSuccess(true);
    } else {
      setAnimateSuccess(false);
    }
    if (loading) {
      setAnimateLoading(true);
    } else {
      setAnimateLoading(false);
    }
  }, [showSuccess, loading]);

  return (
    <div className="relative">
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 262 262"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="rectangleClip">
            <rect x="168.5" y="2.5" width="91" height="91" />
          </clipPath>
        </defs>
        <g id="txn">
          <motion.g
            id="arrows"
            animate={animateLoading ? { rotate: 360 } : {}}
            key={animateLoading ? "loading" : "idle"}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ transformOrigin: "131px 131px" }}
          >
            <path
              id="pNMqDVU9h"
              d="M138.8 222.304C135.5 219.504 131 215.804 128.9 214.004L124.9 210.704L133.3 200.604C137.8 195.004 141.9 190.404 142.2 190.404C142.5 190.404 143.6 191.104 144.6 191.804C146.2 193.104 146 193.604 141.7 199.004C139.1 202.304 136.5 205.404 136 206.104C135.1 207.404 137.5 207.204 148.8 205.304C155.3 204.104 168.6 198.204 174.3 194.004C185.3 185.704 195.4 172.904 200.7 160.404C203.6 153.604 206.3 141.704 206.3 135.704C206.3 132.504 206.5 132.304 209 132.604C211.6 132.904 211.7 133.104 211.5 137.904C210.4 158.904 202.1 175.904 185.5 191.504C171.3 204.804 159.1 210.204 137.5 212.704C136.7 212.804 139.1 215.304 142.8 218.204C149.2 223.404 149.4 223.604 147.7 225.504C146.8 226.504 145.7 227.404 145.4 227.304C145.1 227.304 142.1 225.004 138.8 222.304Z"
              fill="#484444"
            />
            <path
              id="p1D4RQLduK"
              d="M51.7 119.704C52.9 102.204 59.8 87.2044 72.5 73.8044C85.3 60.3044 103.3 50.8044 119.6 48.9044C122.7 48.5044 125.3 47.9044 125.2 47.5044C125.2 47.2044 122.5 44.7044 119.2 42.1044C113.4 37.4044 113.2 37.1044 114.9 35.3044C116.6 33.4044 116.7 33.5044 120.2 36.1044C122.2 37.6044 124.9 39.9044 126.3 41.2044C127.7 42.4044 130.7 44.9044 133 46.7044C135.3 48.5044 137.2 50.1044 137.2 50.4044C137.3 50.7044 135.8 52.5044 134 54.5044C132.3 56.5044 128.6 60.9044 125.8 64.3044C120.6 70.7044 119.3 71.4044 117.3 68.9044C116.3 67.7044 116.9 66.4044 121.2 61.2044C124 57.7044 126.3 54.6044 126.3 54.3044C126.3 53.4044 120.1 54.2044 111.3 56.4044C99.9 59.2044 88.5 66.1044 78.3 76.3044C65.3 89.4044 58.3 104.204 56.6 121.704C56 128.004 55.9 128.404 53.5 128.404H51L51.7 119.704Z"
              fill="#464242"
            />
          </motion.g>
          <g id="outer">
            <rect
              id="Rectangle 1"
              x="2.5"
              y="2.5"
              width="257"
              height="257"
              stroke="white"
              strokeWidth="5"
              fill="none"
            />
            <circle
              id="Ellipse 2"
              cx="131"
              cy="131"
              r="28.5"
              stroke="white"
              strokeWidth="5"
              fill="none"
            />
            <circle
              id="Ellipse 1"
              cx="131"
              cy="131"
              r="128.5"
              stroke="white"
              strokeWidth="5"
              fill="none"
            />
            <rect
              id="Rectangle 2"
              x="168.5"
              y="2.5"
              width="91"
              height="91"
              fill={bgColor}
              stroke="white"
              strokeWidth="5"
            />
          </g>
          <motion.path
            id="tick"
            d="M208.859 59.8033C208.475 60.1877 207.93 60.508 207.45 60.508C206.969 60.508 206.425 60.1717 206.024 59.7873L197.055 50.8186L199.906 47.9678L207.466 55.5271L227.453 35.3955L230.256 38.2943L208.859 59.8033Z"
            fill="#38A83E"
            initial={{ opacity: 0, scale: 0 }}
            animate={
              animateSuccess
                ? {
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut",
                      times: [0, 0.7, 1],
                      scale: {
                        times: [0, 0.7, 1],
                        values: [0, 1.2, 1],
                      },
                    },
                  }
                : { opacity: 0, scale: 0 }
            }
          />
        </g>
      </motion.svg>
    </div>
  );
};

export default TxnAnimation;
