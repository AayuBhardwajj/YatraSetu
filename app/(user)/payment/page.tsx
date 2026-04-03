"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Star, IndianRupee, Wallet, CreditCard, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRideStore } from "@/store/useRideStore";
import { useNegotiationStore } from "@/store/useNegotiationStore";
import { cn } from "@/lib/utils";

const TIPS = [0, 10, 20, 50];

export default function PaymentPage() {
  const router = useRouter();
  const { currentRide, clearRide } = useRideStore();
  const { userOffer, mlSuggested } = useNegotiationStore();
  
  const [selectedTip, setSelectedTip] = useState(0);
  const [rating, setRating] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [isPaid, setIsPaid] = useState(false);

  const savings = mlSuggested - userOffer;
  const totalPrice = userOffer + selectedTip;

  const handlePay = () => {
    setIsPaid(true);
    setTimeout(() => {
      clearRide();
      router.push("/home");
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      {/* Header */}
      <header className="p-4 bg-white border-b border-border flex items-center justify-between z-10 sticky top-0">
        <h1 className="heading-sm text-foreground">Ride Completed</h1>
        <button className="text-muted-foreground" onClick={() => router.push("/home")}>
          <X className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto pb-32">
        {/* Receipt Card */}
        <Card className="p-6 border-border bg-white rounded-card shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20" />
          
          <div className="text-center mb-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Amount</p>
            <h2 className="text-[40px] font-bold text-foreground font-tabular leading-none">₹{totalPrice}</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm py-2 border-b border-dashed border-border opacity-70">
              <span className="text-muted-foreground">From</span>
              <span className="font-medium text-foreground text-right">{currentRide?.from || "Sector 17"}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-dashed border-border opacity-70">
              <span className="text-muted-foreground">To</span>
              <span className="font-medium text-foreground text-right">{currentRide?.to || "Ludhiana"}</span>
            </div>
            
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base Fare</span>
                <span className="font-tabular font-medium">₹130</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Distance (3.2km)</span>
                <span className="font-tabular font-medium">₹50</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-sm text-success">
                  <span className="font-medium">Negotiation Discount</span>
                  <span className="font-tabular font-bold">-₹{savings}</span>
                </div>
              )}
              {selectedTip > 0 && (
                <div className="flex justify-between text-sm text-primary">
                  <span className="font-medium">Driver Tip</span>
                  <span className="font-tabular font-bold">+₹{selectedTip}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <div className="space-y-3">
          <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Payment Method</h3>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: "wallet", label: "Wallet (₹240)", icon: Wallet },
              { id: "upi", label: "Google Pay / UPI", icon: IndianRupee },
              { id: "card", label: "Credit / Debit Card", icon: CreditCard },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all active:scale-[0.99]",
                  paymentMethod === method.id 
                    ? "bg-primary/5 border-primary ring-1 ring-primary" 
                    : "bg-white border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", paymentMethod === method.id ? "bg-primary/10" : "bg-muted")}>
                    <method.icon className={cn("w-5 h-5", paymentMethod === method.id ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <span className={cn("text-sm font-bold", paymentMethod === method.id ? "text-primary" : "text-foreground")}>
                    {method.label}
                  </span>
                </div>
                {paymentMethod === method.id && <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="space-y-3">
          <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Add a Tip</h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {TIPS.map((tip) => (
              <button
                key={tip}
                onClick={() => setSelectedTip(tip)}
                className={cn(
                  "flex-shrink-0 min-w-16 px-4 py-2.5 rounded-full border text-sm font-bold transition-all",
                  selectedTip === tip 
                    ? "bg-primary border-primary text-white" 
                    : "bg-white border-border text-foreground"
                )}
              >
                {tip === 0 ? "Skip" : `₹${tip}`}
              </button>
            ))}
            <button className="flex-shrink-0 px-4 py-2.5 rounded-full border border-border bg-white text-sm font-bold text-foreground">Custom</button>
          </div>
        </div>

        {/* Rating Section */}
        <div className="bg-white p-6 rounded-card border border-border text-center space-y-4">
          <p className="text-sm font-bold text-foreground">How was your ride with Rajesh Kumar?</p>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button 
                key={s}
                onClick={() => setRating(s)}
                className="transition-transform active:scale-90"
              >
                <Star 
                  className={cn(
                    "w-8 h-8", 
                    s <= rating ? "text-[#FFC107] fill-[#FFC107]" : "text-muted-foreground/30"
                  )} 
                />
              </button>
            ))}
          </div>
          <textarea 
            placeholder="Tell us about your ride..."
            className="w-full bg-muted border border-border rounded-xl p-3 text-sm min-h-[80px] focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Pay Action button */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border z-30 pb-12 flex justify-center">
        <div className="w-full max-w-[430px]">
          <Button 
            onClick={handlePay}
            disabled={isPaid}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-pill text-base font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
          >
            {isPaid ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ₹${totalPrice}`
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
