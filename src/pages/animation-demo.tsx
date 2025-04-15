import { useState } from "react";
import TxnAnimation from "../components/txn-animation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnimationDemo() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bgColor, setBgColor] = useState("#000d1e");

  const handleSuccessClick = () => {
    // Reset first
    setShowSuccess(false);
    setLoading(false);

    // Start loading
    setLoading(true);

    // After 2 seconds, show success and stop loading
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
    }, 2000);
  };

  const handleReset = () => {
    setShowSuccess(false);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="flex flex-col items-center space-y-8 p-8">
          <motion.h1
            className="text-2xl font-semibold"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            SVG Transaction Animation
          </motion.h1>

          <Tabs defaultValue="demo" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="demo">Demo</TabsTrigger>
              <TabsTrigger value="customization">Customization</TabsTrigger>
            </TabsList>

            <TabsContent value="demo" className="flex flex-col items-center">
              <div className="my-8">
                <TxnAnimation
                  size={300}
                  showSuccess={showSuccess}
                  loading={loading}
                  bgColor={bgColor}
                />
              </div>

              <div className="flex space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleSuccessClick}
                    className="bg-primary text-primary-foreground"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Process Transaction"}
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button onClick={handleReset} variant="outline">
                    Reset
                  </Button>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="customization" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Background Color:</label>
                <div className="flex space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setBgColor("#000d1e")}
                    className={`h-8 w-8 cursor-pointer rounded-full bg-[#000d1e] ${bgColor === "#000d1e" ? "ring-2 ring-white" : ""}`}
                  />
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setBgColor("#1a1a1a")}
                    className={`h-8 w-8 cursor-pointer rounded-full bg-[#1a1a1a] ${bgColor === "#1a1a1a" ? "ring-2 ring-white" : ""}`}
                  />
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setBgColor("#2d0a28")}
                    className={`h-8 w-8 cursor-pointer rounded-full bg-[#2d0a28] ${bgColor === "#2d0a28" ? "ring-2 ring-white" : ""}`}
                  />
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setBgColor("#0a2d1d")}
                    className={`h-8 w-8 cursor-pointer rounded-full bg-[#0a2d1d] ${bgColor === "#0a2d1d" ? "ring-2 ring-white" : ""}`}
                  />
                </div>
              </div>

              <div className="mb-8 mt-6">
                <TxnAnimation
                  size={200}
                  showSuccess={showSuccess}
                  loading={loading}
                  bgColor={bgColor}
                />
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleSuccessClick} disabled={loading}>
                  {loading ? "Processing..." : "Process Transaction"}
                </Button>
                <Button onClick={handleReset} variant="outline">
                  Reset
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <motion.div
            className="mt-4 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Path animation draws the checkmark when transaction succeeds
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
