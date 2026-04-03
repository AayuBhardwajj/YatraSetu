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
  { id: "cash", label: "Cash", subtext: "Pay at destination", icon: Banknote, color: "text-success", bg: "bg-success-light" },
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
    <div className="min-h-[calc(100vh-64px)] w-full bg-muted/30 flex items-start justify-center p-8 overflow-y-auto no-scrollbar">
      <div className="w-full max-w-[600px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-[28px] font-bold text-text-primary">Payment Methods</h1>
          <p className="text-text-secondary font-medium">Select your preferred way to pay</p>
        </div>

        {/* Amount Card */}
        <Card className="p-8 border-none shadow-xl shadow-primary/5 bg-white rounded-2xl flex flex-col items-center space-y-4">
          <div className="flex flex-col items-center">
            <span className="text-[12px] font-bold text-text-muted uppercase tracking-widest">Amount to pay</span>
            <div className="text-[48px] font-bold text-text-primary font-tabular tracking-tight">
              ₹{finalAmount}.00
            </div>
            <div className="px-4 py-1.5 bg-primary-light text-primary rounded-full text-sm font-semibold flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span>Trip to Railway Station</span>
            </div>
          </div>
        </Card>

        {/* Payment Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest pl-1">Choose Payment Option</h3>
          <div className="grid grid-cols-1 gap-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={cn(
                  "flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 group text-left",
                  paymentMethod === method.id 
                    ? "bg-white border-primary shadow-lg shadow-primary/5" 
                    : "bg-white border-transparent hover:border-border"
                )}
              >
                <div className="flex items-center space-x-4">
                  <div className={cn("p-3 rounded-xl", method.bg)}>
                    <method.icon className={cn("w-6 h-6", method.color)} />
                  </div>
                  <div className="flex flex-col">
                    <span className={cn("text-[16px] font-bold transition-colors", 
                      paymentMethod === method.id ? "text-primary" : "text-text-primary"
                    )}>
                      {method.label}
                    </span>
                    <span className="text-sm text-text-muted font-medium">{method.subtext}</span>
                  </div>
                </div>
                {paymentMethod === method.id ? (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white animate-in zoom-in">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-muted group-hover:border-text-muted" />
                )}
              </button>
            ))}
          </div>

          {/* Add New Option */}
          <button className="w-full flex items-center justify-center space-x-2 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-white transition-all text-text-muted hover:text-primary">
            <Plus className="w-5 h-5" />
            <span className="text-sm font-bold">Add New Payment Method</span>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="space-y-6 pt-4">
          <Button 
            onClick={handlePay}
            disabled={isPaid}
            className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            {isPaid ? (
              <>
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              `Pay ₹${finalAmount}`
            )}
          </Button>

          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2 text-text-muted">
              <ShieldCheck className="w-5 h-5 text-success" />
              <span className="text-[13px] font-bold uppercase tracking-tight">Encrypted & Secure</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center space-x-2 text-text-muted">
              <Check className="w-5 h-5 text-success" />
              <span className="text-[13px] font-bold uppercase tracking-tight">Verified Merchant</span>
            </div>
          </div>
        </div>

        {/* Safety Note */}
        <p className="text-center text-[12px] text-text-muted font-medium px-8 leading-relaxed">
          Your payment information is kept secure. By completing your payment, you agree to our 
          <span className="text-primary font-bold cursor-pointer hover:underline mx-1">Terms of Service</span> 
          and 
          <span className="text-primary font-bold cursor-pointer hover:underline mx-1">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
