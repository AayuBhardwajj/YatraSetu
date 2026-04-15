"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import NegotiationRoom from "@/components/shared/NegotiationRoom";

export default function DriverNegotiatePage() {
  const params = useParams();
  const rideId = params.id as string;
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <NegotiationRoom 
      rideId={rideId} 
      myRole="driver" 
      myUserId={user.id} 
    />
  );
}
