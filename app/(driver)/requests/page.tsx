"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Navigation2, X, Check, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const MOCK_REQUESTS = [
  {
    id: "req1",
    userRating: 4.2,
    distanceToPickup: "1.2km",
    pickup: "Sector 17, Chandigarh",
    drop: "Sector 34, Chandigarh",
    userOffer: 160,
    minML: 150,
    maxML: 220,
    duration: 30,
  },
  {
    id: "req2",
    userRating: 4.9,
    distanceToPickup: "2.4km",
    pickup: "Ludhiana Railway Station",
    drop: "Model Town, Ludhiana",
    userOffer: 120,
    minML: 110,
    maxML: 150,
    duration: 15,
  },
];

export default function DriverRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const handleAccept = (reqId: string) => {
    router.push("/driver/active-ride");
  };

  const handleDecline = (reqId: string) => {
    setRequests(requests.filter(r => r.id !== reqId));
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 p-4 space-y-4 pb-32">
      <h1 className="heading-sm text-foreground mb-2">Live Requests</h1>

      <div className="space-y-4">
        {requests.length > 0 ? (
          requests.map((req) => (
            <RequestCard 
              key={req.id} 
              request={req} 
              onAccept={() => handleAccept(req.id)}
              onDecline={() => handleDecline(req.id)}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No live requests available.
          </div>
        )}
      </div>
    </div>
  );
}

function RequestCard({ request, onAccept, onDecline }: { request: any, onAccept: () => void, onDecline: () => void }) {
  const [timeLeft, setTimeLeft] = useState(request.duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onDecline();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev: number) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onDecline]);

  const progressPercent = (timeLeft / request.duration) * 100;

  return (
    <Card className="relative overflow-hidden border-border bg-white rounded-card shadow-sm animate-in slide-in-from-bottom-5 duration-500">
      <div className="p-4 space-y-4">
        {/* Top Row: User Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-foreground">{request.userRating}</span>
            <span className="text-xs text-muted-foreground ml-1">· {request.distanceToPickup} from you</span>
          </div>
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase font-bold text-[10px]">
            Negotiable
          </Badge>
        </div>

        {/* Route Info */}
        <div className="space-y-2 relative pl-6">
          <div className="absolute left-1 top-1 bottom-1 w-[2px] border-l-2 border-dashed border-border" />
          <div className="relative">
            <div className="absolute left-[-22px] top-1 w-2 h-2 rounded-full bg-success" />
            <p className="text-[13px] font-bold text-foreground truncate">{request.pickup}</p>
          </div>
          <div className="relative">
            <div className="absolute left-[-22px] top-1 w-2 h-2 rounded-full bg-danger" />
            <p className="text-[13px] font-medium text-muted-foreground truncate">{request.drop}</p>
          </div>
        </div>

        {/* Price Row */}
        <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-bold text-primary uppercase tracking-widest">User Offered</span>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Fair range</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold text-primary font-tabular">₹{request.userOffer}</span>
            <span className="text-sm font-bold text-foreground font-tabular mb-0.5">₹{request.minML}-{request.maxML}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
            variant="outline" 
            onClick={onDecline}
            className="h-12 border-border text-foreground font-bold rounded-pill"
          >
            Decline
          </Button>
          <Button 
            onClick={onAccept}
            className="h-12 bg-primary text-white font-bold rounded-pill"
          >
            Accept ₹{request.userOffer}
          </Button>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="h-1.5 bg-muted">
        <div 
          className={cn(
            "h-full transition-all duration-1000 ease-linear",
            timeLeft > 10 ? "bg-primary" : "bg-danger"
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </Card>
  );
}
