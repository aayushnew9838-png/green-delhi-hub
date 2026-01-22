import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, CheckCircle2, IndianRupee, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  availablePoints: number;
}

const RedeemModal = ({ isOpen, onClose, availablePoints }: RedeemModalProps) => {
  const [upiId, setUpiId] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const maxRedeemable = Math.floor(availablePoints / 100);

  const redeemOptions = [
    { points: 500, amount: 5 },
    { points: 1000, amount: 12 },
    { points: 2500, amount: 30 },
  ].filter(opt => availablePoints >= opt.points);

  const validateUpiId = (id: string) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(id);
  };

  const handleRedeem = async () => {
    if (!validateUpiId(upiId)) {
      toast.error("Please enter a valid UPI ID");
      return;
    }

    if (!selectedAmount) {
      toast.error("Please select a redemption amount");
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);

    setTimeout(() => {
      toast.success(`₹${selectedAmount} will be credited to ${upiId} within 24 hours!`);
      onClose();
      setIsSuccess(false);
      setUpiId("");
      setSelectedAmount(null);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card-gradient border border-border rounded-2xl p-6 w-full max-w-md card-shadow"
          onClick={(e) => e.stopPropagation()}
        >
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Redemption Successful!</h3>
              <p className="text-muted-foreground">Processing your UPI transfer...</p>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Redeem to UPI</h3>
                    <p className="text-sm text-muted-foreground">Transfer your rewards</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Available Balance */}
              <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{availablePoints.toLocaleString()}</span>
                  <span className="text-muted-foreground">points</span>
                  <span className="text-success ml-auto font-medium">≈ ₹{maxRedeemable}</span>
                </div>
              </div>

              {/* Select Amount */}
              <div className="mb-6">
                <Label className="text-foreground mb-3 block">Select Amount</Label>
                <div className="grid grid-cols-3 gap-3">
                  {redeemOptions.map((option) => (
                    <button
                      key={option.points}
                      onClick={() => setSelectedAmount(option.amount)}
                      className={`p-3 rounded-xl border transition-all ${
                        selectedAmount === option.amount
                          ? "bg-accent/20 border-accent text-accent"
                          : "bg-secondary/30 border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 font-bold">
                        <IndianRupee className="w-4 h-4" />
                        {option.amount}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{option.points} pts</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* UPI ID Input */}
              <div className="mb-6">
                <Label htmlFor="upiId" className="text-foreground mb-2 block">
                  Your UPI ID
                </Label>
                <Input
                  id="upiId"
                  placeholder="yourname@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="bg-secondary/50 border-border"
                />
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Supports all UPI apps (GPay, PhonePe, Paytm, etc.)
                </p>
              </div>

              {/* Redeem Button */}
              <Button
                variant="accent"
                className="w-full"
                onClick={handleRedeem}
                disabled={!selectedAmount || !upiId || isProcessing}
              >
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full"
                  />
                ) : (
                  <>Redeem ₹{selectedAmount || 0} to UPI</>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Transfers are processed within 24 hours
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RedeemModal;
