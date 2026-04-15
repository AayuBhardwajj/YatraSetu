"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Navigation2, 
  User, 
  Phone, 
  MessageCircle, 
  MoreVertical, 
  Check, 
  MapPin, 
  AlertCircle,
  Clock,
  Navigation,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "arrived", label: "Heading to Pickup", button: "I have Arrived", instruction: "Head East on Sector 17 Rd", distance: "400m" },
  { id: "started", label: "Ongoing Trip", button: "Slide to Start Trip", instruction: "Turn Right towards Airport Rd", distance: "1.2km" },
  { id: "completed", label: "Near Destination", button: "Complete Ride", instruction: "Arriving at Terminal 1", distance: "200m" },
];

export default function DriverActiveRidePage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const router = useRouter();

  const handleNextStep = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      router.push("/earnings");
    }
  };

  const currentStep = STEPS[stepIndex];

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      {/* Left Column: Navigation Map (70%) */}
      <div className="w-[70%] h-full relative border-r border-border">
        <MapPlaceholder 
          height="100%" 
          showRoute={true} 
          showDriverDots={false} 
        />
        
        {/* Navigation Overlays */}
        <div className="absolute top-8 left-8 right-8 z-10 flex flex-col space-y-4">
          <Card className="p-6 bg-primary/95 backdrop-blur-md text-white border-none shadow-2xl rounded-[32px] flex items-center justify-between animate-in slide-in-from-top-4 duration-200">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Navigation className="w-10 h-10 transform -rotate-45" />
              </div>
              <div>
                <span className="text-sm font-bold opacity-80 uppercase tracking-widest pl-1">{currentStep.distance}</span>
                <h2 className="text-2xl font-bold">{currentStep.instruction}</h2>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-3xl font-bold font-tabular">8 min</span>
              <span className="text-sm font-bold opacity-80 uppercase tracking-widest">3.2 km left</span>
            </div>
          </Card>
        </div>

        {/* Live Indicator */}
        <div className="absolute bottom-8 left-8 z-10 flex items-center space-x-3 px-4 py-2 bg-success/20 backdrop-blur-sm border border-success/30 rounded-full">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-xs font-bold text-success uppercase tracking-widest leading-none">Live Navigation System</span>
        </div>
      </div>

      {/* Right Column: Trip Details (30%) */}
      <aside className="w-[30%] h-full bg-white overflow-y-auto no-scrollbar flex flex-col">
        <div className="p-8 border-b border-border">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Active Trip Details</h3>
            <Badge className="bg-primary-light text-primary border-transparent px-4 py-1 rounded-full font-bold">
              {currentStep.label}
            </Badge>
          </div>

          {/* User Info Card */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold text-2xl shadow-inner">
              AS
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="text-lg font-bold text-text-primary">Arjun Sharma</h4>
                <div className="flex items-center text-warning font-bold text-sm">
                  <Check className="w-3.5 h-3.5 mr-1 text-success" />
                  Verified
                </div>
              </div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">A-List Member · 4.9 ★</p>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <Button variant="outline" className="h-12 border-border text-text-primary hover:bg-muted font-bold rounded-xl space-x-2">
              <Phone className="w-4 h-4" />
              <span>Call Rider</span>
            </Button>
            <Button variant="outline" className="h-12 border-border text-text-primary hover:bg-muted font-bold rounded-xl space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
            </Button>
          </div>

          {/* Route Stepper */}
          <div className="space-y-6">
            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
              <div className="relative">
                <div className="absolute left-[-26px] top-1 w-[18px] h-[18px] rounded-full bg-success border-4 border-white shadow-sm ring-1 ring-success/20" />
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Pickup Location</p>
                  <p className="text-sm font-bold text-text-primary truncate">Sector 17, Chandigarh</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute left-[-26px] top-1 w-[18px] h-[18px] rounded-full bg-danger border-4 border-white shadow-sm ring-1 ring-danger/20" />
                <div>
                  <p className="text-[10px] font-bold text-success uppercase tracking-widest mb-1">Destination Location</p>
                  <p className="text-sm font-bold text-text-primary truncate">Airport Terminal 1</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* Action Controls */}
        <div className="p-8 space-y-4">
          <Button 
            variant="outline" 
            className="w-full h-12 border-danger/20 text-danger hover:bg-danger-light hover:border-danger/40 font-bold rounded-xl space-x-2 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency SOS</span>
          </Button>

          <div className="relative h-18 w-full p-1.5 bg-muted rounded-[24px] border border-border group overflow-hidden">
            <div className={cn(
              "absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity",
              isSliding && "opacity-10"
            )} />
            <Button 
              onClick={handleNextStep}
              className={cn(
                "w-full h-full bg-primary hover:bg-primary/90 text-white rounded-[18px] font-bold text-lg transition-all active:scale-[0.98] shadow-xl shadow-primary/20 flex items-center justify-center space-x-4",
                stepIndex === 2 && "bg-success hover:bg-success/90 shadow-success/20"
              )}
            >
              <span>{currentStep.button}</span>
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </Button>
          </div>

          <p className="text-center text-[10px] text-text-muted font-bold uppercase tracking-widest pt-2">
            Zipp Secure Ride System · IP: 192.168.1.1
          </p>
        </div>
      </aside>
    </div>
  );
}
