"use client";

import { useState } from "react";
import TxnAnimation from "@/components/txn-animation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";

import LoadingAnimation from "@/components/loading";
import LoadingAnimationTwo from "@/components/loadingtwo";

export default function AnimationDemo() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <div className="dark flex min-h-screen flex-col items-center justify-center bg-bg-t3 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="flex flex-col items-center space-y-8 bg-bg-t3 p-8">
          <motion.h1
            className="text-2xl font-semibold"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Transaction Animation
          </motion.h1>

          <div className="mb-8">
            <TxnAnimation
              size={300}
              showSuccess={showSuccess}
              loading={loading}
            />
          </div>

          <div className="flex space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowSuccess(!showSuccess)}
                className="bg-primary text-primary-foreground"
              >
                Show Success Animation
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => setLoading(!loading)} variant="outline">
                {loading ? "Stop Loading Animation" : "Show Loading Animation"}
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="mt-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Hover over buttons to see additional animations
          </motion.div>
        </Card>
        <Card className="flex flex-col items-center space-y-8 bg-bg-t3 p-8">
          <LoadingAnimationTwo
            loading={loading}
            showSuccess={showSuccess}
            bgColor="#fff"
          />
        </Card>
      </motion.div>
    </div>
  );
}
