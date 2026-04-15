"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Check, 
  Star, 
  IndianRupee, 
  Wallet, 
  CreditCard, 
  ChevronRight, 
  X,
  ShieldCheck,
  Smartphone,
  Banknote,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRideStore } from "@/store/useRideStore";
import { useNegotiationStore } from "@/store/useNegotiationStore";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = [
  { id: "wallet", label: "Zipp Wallet", subtext: "Balance: ₹420", icon: Wallet, color: "text-primary", bg: "bg-primary-light" },
  { id: "upi", label: "UPI (PhonePe / GPay)", subtext: "Quick & Secure", icon: Smartphone, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "card", label: "Credit/Debit Card", subtext: "Add new card", icon: CreditCard, color: "text-purple-500", bg: "bg-purple-50" },
  { id: "cash", label: "Cash", subtext: "Pay at destination", icon: Banknote, color: "text-success", bg: "bg-success/10" },
];

export default function PaymentPage() {
  const router = useRouter();
  const { currentRide, clearRide } = useRideStore();
  const { userOffer } = useNegotiationStore();
  
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [isPaid, setIsPaid] = useState(false);

  const finalAmount = userOffer || 160;

  const handlePay = () => {
    setIsPaid(true);
    setTimeout(() => {
      clearRide();
      router.push("/home");
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-muted/20 flex items-start justify-center p-6 overflow-y-auto no-scrollbar">
      <div className="w-full max-w-[560px] space-y-6   duration-200">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-bold text-text-primary">Complete Payment</h1>
          <p className="text-sm text-text-secondary font-medium">Select your preferred way to pay</p>
        </div>

        {/* Amount Card */}
        <Card className="p-6 border-none shadow-lg shadow-primary/5 bg-white rounded-2xl flex flex-col items-center space-y-3">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Amount to pay</span>
          <div className="text-4xl font-bold text-text-primary font-tabular tracking-tight">
            ₹{finalAmount}.00
          </div>
          <div className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm font-semibold flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
            <span>Trip to Railway Station</span>
          </div>
        </Card>

        {/* Payment Options */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider pl-1">Choose Payment</h3>
          <div className="space-y-2.5">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 group text-left",
                  paymentMethod === method.id 
                    ? "bg-white border-primary/30 shadow-md shadow-primary/5" 
                    : "bg-white border-transparent hover:border-border/50"
                )}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className={cn("p-2.5 rounded-xl flex-shrink-0", method.bg)}>
                    <method.icon className={cn("w-5 h-5", method.color)} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className={cn("text-sm font-bold transition-colors truncate", 
                      paymentMethod === method.id ? "text-primary" : "text-text-primary"
                    )}>
                      {method.label}
                    </span>
                    <span className="text-xs text-text-muted font-medium truncate">{method.subtext}</span>
                  </div>
                </div>
                {paymentMethod === method.id ? (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white flex-shrink-0 ml-2">
                    <Check className="w-3 h-3" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-border/50 group-hover:border-text-muted flex-shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>

          {/* Add New */}
          <button className="w-full flex items-center justify-center space-x-2 p-3.5 rounded-xl border-2 border-dashed border-border hover:border-primary/30 hover:bg-white transition-all text-text-muted hover:text-primary">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-bold">Add New Payment Method</span>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="space-y-5 pt-2">
          <Button 
            onClick={handlePay}
            disabled={isPaid}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl text-base font-bold shadow-xl shadow-primary/15 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
          >
            {isPaid ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              `Pay ₹${finalAmount}`
            )}
          </Button>

          <div className="flex items-center justify-center gap-5 flex-wrap">
            <div className="flex items-center space-x-1.5 text-text-muted">
              <ShieldCheck className="w-4 h-4 text-success flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-tight">Encrypted</span>
            </div>
            <div className="w-px h-3.5 bg-border" />
            <div className="flex items-center space-x-1.5 text-text-muted">
              <Check className="w-4 h-4 text-success flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-tight">Verified</span>
            </div>
          </div>
        </div>

        {/* Safety Note */}
        <p className="text-center text-[11px] text-text-muted font-medium px-4 leading-relaxed pb-4">
          By completing your payment, you agree to our 
          <span className="text-primary font-bold cursor-pointer hover:underline mx-1">Terms</span> 
          and 
          <span className="text-primary font-bold cursor-pointer hover:underline mx-1">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
