import React, { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRightLeft, Wallet2, LogOut } from "lucide-react";

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
      isMetaMask?: boolean;
    };
  }
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  onDisconnect,
}) => {
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [showDisconnect, setShowDisconnect] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      if (window.ethereum) {
        const accounts: any = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts[0]) {
          setAddress(accounts[0]);
          setIsConnected(true);
          onConnect?.(accounts[0]);
        }
      }
    } catch (error) {
      console.error("Error connecting:", error);
      setIsConnected(false);
      setAddress("");
    }
    setLoading(false);
  };

  const handleDisconnect = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
        console.log("Wallet permissions revoked.");
      }

      setIsConnected(false);
      setAddress("");
      setShowDisconnect(false);

      localStorage.removeItem("walletConnected");

      onDisconnect?.();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return (
    <div>
      {!isConnected ? (
        <Button
          onClick={handleConnect}
          disabled={loading}
          className="h-8 w-48 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:via-emerald-400 hover:to-emerald-500 text-emerald-50 font-bold border border-emerald-500 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-900/50 transition-all duration-300 rounded-none relative overflow-hidden hover:scale-[1.02] group"
        >
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer"></div>
          <div className="flex items-center justify-center space-x-2">
            {loading ? (
              <ArrowRightLeft className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Wallet2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="uppercase tracking-widest text-xs">
                  Connect
                </span>
              </>
            )}
          </div>
        </Button>
      ) : (
        <div className="relative group">
          <div
            className="px-3 py-1 bg-emerald-900/20 border border-emerald-800 text-emerald-400 text-xs font-mono tracking-wide overflow-hidden cursor-pointer hover:bg-emerald-900/30 hover:border-emerald-700 transition-all duration-300 rounded-none"
            onMouseEnter={() => setShowDisconnect(true)}
            onMouseLeave={() => setShowDisconnect(false)}
            onClick={handleDisconnect}
          >
            <div className="flex items-center justify-between space-x-2">
              <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
              <LogOut
                className={`w-3.5 h-3.5 transition-all duration-300 ${
                  showDisconnect
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2"
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
