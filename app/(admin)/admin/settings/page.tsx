"use client";
import React from "react";
export default function Page() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center opacity-30">
        <div className="w-8 h-8 border-4 border-muted-foreground rounded-full" />
      </div>
      <h1 className="heading-sm text-foreground">Placeholder Page</h1>
      <p className="text-sm text-muted-foreground">This feature is coming soon to the Zipp platform.</p>
    </div>
  );
}
