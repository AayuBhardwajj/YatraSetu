"use client";

import React, { useState } from "react";
import { 
  Zap, 
  Info, 
  Save, 
  History, 
  Search, 
  Plus, 
  ChevronRight,
  BrainCircuit,
  TrendingUp,
  Clock,
  AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function AdminPricingPage() {
  const [surgeMultiplier, setSurgeMultiplier] = useState([1.2]);
  const [isSurgeEnabled, setIsSurgeEnabled] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ML Pricing Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage global pricing algorithms and surge multipliers.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-10 bg-white text-foreground">
            <History className="w-4 h-4 mr-2" />
            Audit Logs
          </Button>
          <Button className="h-10 bg-primary text-white hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Model Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-white border-border rounded-card flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-success" />
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center">
              <BrainCircuit className="w-8 h-8 text-success" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-success/20 text-success text-[10px] font-bold uppercase border-none">Active</Badge>
                <h3 className="font-bold text-foreground">ZippML Model v4.8</h3>
              </div>
              <p className="text-sm text-muted-foreground">Last trained: Today, 04:20 AM · Dataset: 1.2M trips</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Model Accuracy</p>
            <div className="flex items-end justify-end gap-1">
              <span className="text-3xl font-bold text-foreground font-tabular">94.2%</span>
              <TrendingUp className="w-5 h-5 text-success mb-1" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-primary text-white rounded-card flex flex-col justify-between shadow-lg shadow-primary/10">
          <div className="flex items-center justify-between mb-4">
             <span className="text-[12px] font-bold text-white/70 uppercase tracking-widest">Global Surge</span>
             <Switch 
               checked={isSurgeEnabled} 
               onCheckedChange={setIsSurgeEnabled} 
               className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/20"
             />
          </div>
          <div>
            <h4 className="text-sm font-bold opacity-80 mb-1">Surge Multiplier</h4>
            <div className="flex items-center justify-between">
              <span className="text-[32px] font-bold font-tabular">{isSurgeEnabled ? surgeMultiplier[0] : "1.0"}x</span>
              {isSurgeEnabled && <Zap className="w-6 h-6 text-warning fill-warning" />}
            </div>
          </div>
        </Card>
      </div>

      {/* Zone Config Tabs */}
      <Tabs defaultValue="chandigarh" className="w-full space-y-6">
        <div className="flex items-center justify-between bg-white border border-border p-2 rounded-xl">
           <TabsList className="bg-muted/50 p-1 rounded-lg">
             <TabsTrigger value="chandigarh" className="rounded-lg text-xs font-bold uppercase tracking-widest px-6 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Chandigarh Central</TabsTrigger>
             <TabsTrigger value="zirakpur" className="rounded-lg text-xs font-bold uppercase tracking-widest px-6 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Zirakpur / Mohali</TabsTrigger>
             <TabsTrigger value="ludhiana" className="rounded-lg text-xs font-bold uppercase tracking-widest px-6 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Ludhiana Hub</TabsTrigger>
           </TabsList>
           <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Plus className="w-4 h-4 mr-1" /> Add Zone
           </Button>
        </div>

        {["chandigarh", "zirakpur", "ludhiana"].map((zone) => (
          <TabsContent key={zone} value={zone} className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: General Settings */}
              <Card className="lg:col-span-2 p-6 bg-white border-border rounded-card space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      Base Price Per KM <Info className="w-3 h-3 opacity-50" />
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-tabular">₹</span>
                      <Input defaultValue="18.50" className="pl-8 h-12 bg-muted/30 border-border text-base font-bold font-tabular rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      Min Ride Fixed Cost <Info className="w-3 h-3 opacity-50" />
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-tabular">₹</span>
                      <Input defaultValue="45.00" className="pl-8 h-12 bg-muted/30 border-border text-base font-bold font-tabular rounded-xl" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                         <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Dynamic Multiplier Range</h4>
                         <p className="text-xs text-muted-foreground">ML will stay within these bounds during surges.</p>
                    </div>
                    <div className="text-right">
                       <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">RECOMMENDED: 1.2x - 1.8x</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Slider 
                      defaultValue={[1.2, 2.4]} 
                      step={0.1} 
                      max={4.0} 
                      min={1.0} 
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs font-bold text-muted-foreground font-tabular opacity-70">
                       <span>1.0x (Normal)</span>
                       <span>2.5x (Peak)</span>
                       <span>4.0x (Emergency)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <p className="text-[11px] font-medium text-amber-700 bg-amber-50 p-2 rounded-lg flex-1">
                    Changes to this zone will affect live pricing for <strong>147 active drivers</strong> and <strong>249 active users</strong> immediately.
                  </p>
                </div>
              </Card>

              {/* Right: Peak Hours Sidepanel */}
              <Card className="p-6 bg-white border-border rounded-card space-y-6">
                 <h4 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                   Peak Hours Config <Clock className="w-3 h-3 opacity-50" />
                 </h4>
                 
                 <div className="space-y-3">
                    {[
                      { label: "Morning Rush", time: "08:00 - 11:00", surge: "1.4x" },
                      { label: "Evening Rush", time: "17:00 - 21:00", surge: "1.8x" },
                      { label: "Late Night", time: "23:00 - 02:00", surge: "1.2x" },
                    ].map((peak, i) => (
                      <div key={i} className="p-3 border border-border rounded-xl flex items-center justify-between hover:bg-muted/30 transition-all cursor-pointer group">
                        <div>
                          <p className="text-sm font-bold text-foreground">{peak.label}</p>
                          <p className="text-[11px] text-muted-foreground">{peak.time}</p>
                        </div>
                        <Badge variant="outline" className="border-border text-primary font-bold font-tabular group-hover:bg-primary group-hover:text-white transition-all">{peak.surge}</Badge>
                      </div>
                    ))}
                    <Button variant="ghost" className="w-full border-2 border-dashed border-border rounded-xl h-12 text-muted-foreground hover:text-primary hover:border-primary/50 text-[12px] font-bold uppercase tracking-widest">
                       <Plus className="w-4 h-4 mr-2" /> Add Peak Window
                    </Button>
                 </div>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
