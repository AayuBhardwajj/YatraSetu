"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Star, 
  MapPin, 
  Navigation2, 
  Check, 
  X, 
  Timer, 
  ChevronRight,
  TrendingUp,
  Zap,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { cn } from "@/lib/utils";

const MOCK_REQUESTS = [
  {
    id: "req1",
    userRating: 4.8,
    distanceToPickup: "1.2 km",
    pickup: "Sector 17, Chandigarh",
    drop: "Sector 34, Chandigarh",
    userOffer: 160,
    minML: 150,
    maxML: 220,
    duration: 30,
    type: "Premium",
    estTime: "12 min",
    estDist: "4.2 km"
  },
  {
    id: "req2",
    userRating: 4.9,
    distanceToPickup: "2.4 km",
    pickup: "Ludhiana Railway Station",
    drop: "Model Town, Ludhiana",
    userOffer: 120,
    minML: 110,
    maxML: 150,
    duration: 15,
    type: "Standard",
    estTime: "8 min",
    estDist: "3.1 km"
  },
  {
    id: "req3",
    userRating: 4.5,
    distanceToPickup: "0.8 km",
    pickup: "PGI Hospital",
    drop: "Chandigarh University",
    userOffer: 340,
    minML: 300,
    maxML: 450,
    duration: 45,
    type: "Long Distance",
    estTime: "35 min",
    estDist: "18.5 km"
  },
];

export default function DriverRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [selectedReqId, setSelectedReqId] = useState(MOCK_REQUESTS[0].id);

  const selectedRequest = requests.find(r => r.id === selectedReqId) || requests[0];

  const handleAccept = (reqId: string) => {
    router.push("/active-ride");
  };

  const handleDecline = (reqId: string) => {
    const newRequests = requests.filter(r => r.id !== reqId);
    setRequests(newRequests);
    if (selectedReqId === reqId && newRequests.length > 0) {
      setSelectedReqId(newRequests[0].id);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      {/* Left Column: Request List (50%) */}
      <div className="w-[50%] h-full flex flex-col border-r border-border bg-white">
        <div className="p-8 border-b border-border flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Live Requests</h1>
            <p className="text-sm text-text-muted font-medium">Manage pending ride requests</p>
          </div>
          <Badge className="bg-success-light text-success border-transparent px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]">
            {requests.length} Active
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
          {requests.length > 0 ? (
            requests.map((req) => (
              <RequestItem 
                key={req.id} 
                request={req} 
                isSelected={selectedReqId === req.id}
                onSelect={() => setSelectedReqId(req.id)}
                onAccept={() => handleAccept(req.id)}
                onDecline={() => handleDecline(req.id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
              <Zap className="w-16 h-16 text-text-muted" />
              <p className="text-lg font-bold text-text-muted">No live requests</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Route Details & Map (50%) */}
      <div className="w-[50%] h-full flex flex-col">
        <div className="flex-1 relative">
          <MapPlaceholder 
            height="100%" 
            showRoute={true} 
            showRequestPins={true} 
          />
          
          {/* Route Details Overlay */}
          {selectedRequest && (
            <div className="absolute top-6 left-6 right-6 z-10 animate-in slide-in-from-top-4 duration-500">
              <Card className="p-6 bg-white/90 backdrop-blur-md border-border shadow-xl rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Route Estimate</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-text-primary font-tabular tracking-tight">{selectedRequest.estDist}</span>
                      <span className="text-[11px] text-text-muted font-medium uppercase tracking-tight">Total distance</span>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-primary font-tabular tracking-tight">{selectedRequest.estTime}</span>
                      <span className="text-[11px] text-text-muted font-medium uppercase tracking-tight">Est. travel time</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold mb-1">
                    Normal Traffic
                  </Badge>
                  <span className="text-[12px] font-bold text-text-muted uppercase tracking-tighter flex items-center">
                    <Info className="w-3.5 h-3.5 mr-1" />
                    High Reliability User
                  </span>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Selected Request Info Footer */}
        {selectedRequest && (
          <div className="h-[280px] bg-white border-t border-border p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center text-primary font-bold text-lg shadow-sm">
                  {selectedRequest.userRating}
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-lg">New Request Received</h3>
                  <p className="text-sm text-text-muted font-medium">{selectedRequest.distanceToPickup} away from your current location</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-primary font-tabular tracking-tight">₹{selectedRequest.userOffer}</span>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Base Offer</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Pickup Information</span>
                <p className="text-sm font-semibold text-text-primary truncate flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-success" />
                  {selectedRequest.pickup}
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Drop Information</span>
                <p className="text-sm font-semibold text-text-primary truncate flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-danger" />
                  {selectedRequest.drop}
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={() => handleAccept(selectedRequest.id)}
                className="flex-1 h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold shadow-xl shadow-primary/20 text-lg transition-all active:scale-[0.98]"
              >
                Accept Ride Request
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push(`/driver-negotiate/${selectedRequest.id}`)}
                className="flex-1 h-16 border-primary text-primary hover:bg-primary-light rounded-2xl font-bold text-lg transition-all"
              >
                Negotiate Fare
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RequestItem({ request, isSelected, onSelect, onAccept, onDecline }: any) {
  const [timeLeft, setTimeLeft] = useState(request.duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onDecline();
      return;
    }
    const timer = setInterval(() => setTimeLeft((p: number) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onDecline]);

  const progressPercent = (timeLeft / request.duration) * 100;

  return (
    <Card 
      onClick={onSelect}
      className={cn(
        "relative overflow-hidden border-2 transition-all cursor-pointer group rounded-2xl animate-in slide-in-from-left-4 duration-500",
        isSelected ? "border-primary shadow-xl shadow-primary/5 bg-white" : "border-transparent bg-muted/40 hover:bg-muted/60"
      )}
    >
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-white transition-opacity",
              isSelected ? "bg-primary" : "bg-text-muted opacity-40"
            )}>
              <Navigation2 className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{request.type}</span>
              <p className="text-[16px] font-bold text-text-primary group-hover:text-primary transition-colors">₹{request.userOffer}</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-xs font-bold text-text-muted">{request.distanceToPickup}</span>
            <div className="flex items-center text-warning font-bold text-xs">
              <Star className="w-3 h-3 mr-1 fill-warning" />
              {request.userRating}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-1.5 h-1.5 bg-success rounded-full" />
            <span className="text-sm font-semibold text-text-primary truncate">{request.pickup}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-1.5 h-1.5 bg-danger rounded-full" />
            <span className="text-sm font-medium text-text-muted truncate">{request.drop}</span>
          </div>
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div className="h-1.5 w-full bg-muted/50">
        <div 
          className={cn(
            "h-full transition-all duration-1000 linear",
            timeLeft < 10 ? "bg-danger" : "bg-primary"
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </Card>
  );
}
