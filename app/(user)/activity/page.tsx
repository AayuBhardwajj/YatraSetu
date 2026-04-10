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
    <div className="min-h-[calc(100vh-64px)] w-full bg-muted/20 flex justify-center p-6 overflow-y-auto no-scrollbar">
      <div className="w-full max-w-[800px] space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">Activity</h1>
          <Button variant="outline" size="sm" className="bg-white border-border text-text-secondary hover:text-primary rounded-xl h-9">
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            Filters
          </Button>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border border-border/50 p-1 rounded-xl h-11 w-full mb-6">
            <TabsTrigger 
              value="active" 
              className="flex-1 rounded-lg text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
            >
              <Activity className="w-4 h-4 mr-1.5" />
              Active Rides
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex-1 rounded-lg text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
            >
              <Clock className="w-4 h-4 mr-1.5" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-5 focus:outline-none">
            {currentRide ? (
              <Card className="p-5 border-border/50 shadow-lg shadow-primary/5 bg-white rounded-2xl animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-success/10 rounded-full flex items-center justify-center text-success flex-shrink-0">
                      <Navigation2 className="w-4 h-4 fill-success transition-transform rotate-45" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary text-sm">Ongoing Trip</h3>
                      <p className="text-xs text-text-muted">Tracking live location</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-success/10 border-success/20 text-success font-bold uppercase tracking-wider text-[10px]">
                    In Progress
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-5">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Driver</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                        RK
                      </div>
                      <span className="text-sm font-semibold text-text-primary truncate">{driverInfo?.name || "Rajesh Kumar"}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Destination</span>
                    <p className="text-sm font-semibold text-text-primary truncate">{currentRide.dropoff}</p>
                  </div>
                </div>

                <Button 
                  onClick={() => router.push("/tracking")}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/15 text-sm"
                >
                  Track Live Trip
                  <ChevronRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center opacity-30">
                  <Activity className="w-8 h-8 text-text-muted" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-text-primary">No active rides</h3>
                  <p className="text-sm text-text-muted max-w-[280px]">Your current trips will appear here for live tracking.</p>
                </div>
                <Button 
                  onClick={() => router.push("/booking")}
                  variant="outline" 
                  className="mt-3 border-primary text-primary hover:bg-primary-light font-bold px-6 rounded-xl h-11 text-sm"
                >
                  Book a Ride
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-3 focus:outline-none">
            {HISTORY_RIDES.map((ride) => (
              <Card 
                key={ride.id}
                className="p-4 border-border/50 hover:border-primary/20 transition-all cursor-pointer bg-white group rounded-xl"
                onClick={() => router.push(`/activity/ride/${ride.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-muted group-hover:bg-primary-light rounded-xl flex items-center justify-center text-text-muted group-hover:text-primary transition-colors flex-shrink-0">
                      <ride.icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0 pr-3">
                      <span className="text-sm font-bold text-text-primary truncate group-hover:text-primary transition-colors">
                        To {ride.to}
                      </span>
                      <div className="flex items-center space-x-1.5 text-text-muted text-xs font-medium">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{ride.date}</span>
                        <span>·</span>
                        <span>{ride.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
                    <span className="text-base font-bold text-text-primary font-tabular">₹{ride.price}</span>
                    <div className="flex items-center space-x-1 text-success font-bold text-[10px] uppercase tracking-wider bg-success/10 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
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
