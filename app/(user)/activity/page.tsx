"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Activity, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Bike, 
  Car, 
  Navigation2,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Filter
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRideStore } from "@/store/useRideStore";
import { cn } from "@/lib/utils";

const HISTORY_RIDES = [
  { id: "H1", to: "Railway Station", date: "12 Oct, 4:30 PM", price: 160, category: "Sedan", status: "Completed", icon: Car },
  { id: "H2", to: "Model Town", date: "10 Oct, 11:20 AM", price: 85, category: "Auto", icon: Car },
  { id: "H3", to: "Sector 17 Market", date: "08 Oct, 09:15 PM", price: 45, category: "Bike", icon: Bike },
  { id: "H4", to: "Airport Terminal 1", date: "05 Oct, 02:45 AM", price: 320, category: "Sedan", icon: Car },
];

export default function ActivityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "active";
  
  const { currentRide, driverInfo } = useRideStore();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-muted/30 flex justify-center p-8 overflow-y-auto no-scrollbar">
      <div className="w-full max-w-[800px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-bold text-text-primary underline decoration-primary/20 underline-offset-8">Activity</h1>
          <Button variant="outline" size="sm" className="bg-white border-border text-text-secondary hover:text-primary">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border border-border p-1 rounded-xl h-12 w-full mb-8">
            <TabsTrigger 
              value="active" 
              className="flex-1 rounded-lg text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
            >
              <Activity className="w-4 h-4 mr-2" />
              Active Rides
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex-1 rounded-lg text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
            >
              <Clock className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6 focus:outline-none">
            {currentRide ? (
              <Card className="p-6 border-border shadow-xl shadow-primary/5 bg-white rounded-2xl animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success-light rounded-full flex items-center justify-center text-success">
                      <Navigation2 className="w-5 h-5 fill-success transition-transform rotate-45" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary">Ongoing Trip</h3>
                      <p className="text-xs text-text-muted">Tracking live location</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-success-light border-success/20 text-success font-bold uppercase tracking-wider text-[10px]">
                    In Progress
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="space-y-2">
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Driver</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold text-sm">
                        RK
                      </div>
                      <span className="text-sm font-semibold text-text-primary">{driverInfo?.name || "Rajesh Kumar"}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Destination</span>
                    <p className="text-sm font-semibold text-text-primary truncate">{currentRide.to}</p>
                  </div>
                </div>

                <Button 
                  onClick={() => router.push("/tracking")}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                >
                  Track Live Trip
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center opacity-40">
                  <Activity className="w-10 h-10 text-text-muted" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-text-primary">No active rides</h3>
                  <p className="text-sm text-text-muted max-w-[280px]">Your current trips will appear here for live tracking.</p>
                </div>
                <Button 
                  onClick={() => router.push("/booking")}
                  variant="outline" 
                  className="mt-4 border-primary text-primary hover:bg-primary-light font-bold px-8 rounded-xl h-12"
                >
                  Book a Ride
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4 focus:outline-none">
            {HISTORY_RIDES.map((ride) => (
              <Card 
                key={ride.id}
                className="p-5 border-border hover:border-primary/30 transition-all cursor-pointer bg-white group rounded-xl"
                onClick={() => router.push(`/activity/ride/${ride.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 truncate">
                    <div className="w-12 h-12 bg-muted group-hover:bg-primary-light rounded-2xl flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                      <ride.icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col truncate pr-4">
                      <span className="text-[16px] font-bold text-text-primary truncate group-hover:text-primary transition-colors">
                        To {ride.to}
                      </span>
                      <div className="flex items-center space-x-2 text-text-muted text-xs font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{ride.date}</span>
                        <span>·</span>
                        <span>{ride.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className="text-lg font-bold text-text-primary font-tabular tracking-tight">₹{ride.price}</span>
                    <div className="flex items-center space-x-1 text-success font-bold text-[10px] uppercase tracking-wider bg-success-light px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Completed</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
