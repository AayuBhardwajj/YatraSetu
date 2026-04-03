"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket/socket";

export const useSocket = () => {
  useEffect(() => {
    if (!socket.connected) socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  const on = (event: string, callback: (...args: unknown[]) => void) => {
    socket.on(event, callback);
    return () => socket.off(event, callback);
  };

  const emit = (event: string, payload?: unknown) => {
    if (!socket.connected) socket.connect();
    socket.emit(event, payload);
  };

  return { socket, on, emit };
};
