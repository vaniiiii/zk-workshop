import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowRightLeft, Wallet, KeyRound } from "lucide-react";

const TornadoCashDemo = () => {
  const [activeTab, setActiveTab] = useState("deposit");
  const [recipient, setRecipient] = useState("");
  const [nullifierHash, setNullifierHash] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleWithdraw = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-pulse-slow absolute w-96 h-96 bg-gradient-to-br from-emerald-900/30 to-transparent rounded-full blur-3xl -top-32 -left-32"></div>
        <div className="animate-pulse-slow absolute w-80 h-80 bg-gradient-to-br from-emerald-900/30 to-transparent rounded-full blur-3xl top-32 right-32"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white tracking-tight mb-4 hover:scale-105 transition-transform duration-300">
            Tornado Cash
          </h1>
          <p className="text-zinc-400 text-sm uppercase tracking-wide">
            Privacy. Freedom. Anonymity.
          </p>
        </div>

        <Card className="relative bg-black border border-emerald-800 shadow-2xl backdrop-blur-lg hover:border-emerald-700 transition-colors duration-300">
          <div className="flex text-lg font-bold tracking-wider">
            <button
              onClick={() => setActiveTab("deposit")}
              className={`flex-1 px-4 py-3 transition-all duration-300 hover:bg-zinc-900/30 uppercase text-sm tracking-widest ${
                activeTab === "deposit"
                  ? "text-emerald-400 bg-zinc-900/50"
                  : "text-zinc-600 hover:text-emerald-400"
              }`}
            >
              Deposit
            </button>
            <button
              onClick={() => setActiveTab("withdraw")}
              className={`flex-1 px-4 py-3 transition-all duration-300 hover:bg-zinc-900/30 uppercase text-sm tracking-widest ${
                activeTab === "withdraw"
                  ? "text-emerald-400 bg-zinc-900/50"
                  : "text-zinc-600 hover:text-emerald-400"
              }`}
            >
              Withdraw
            </button>
          </div>

          <CardContent className="p-6">
            {activeTab === "deposit" ? (
              <div className="space-y-4">
                <div className="relative p-4 rounded-lg bg-gradient-to-b from-zinc-900/50 to-black border border-zinc-800/50 text-center hover:border-emerald-800 transition-colors duration-300">
                  <span className="text-xs uppercase tracking-widest text-zinc-500 mb-1 block font-bold">
                    Amount
                  </span>
                  <span className="text-4xl font-extrabold text-emerald-500">
                    1.0 ETH
                  </span>
                  <span className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 text-[10px] text-zinc-600 bg-black px-2 rounded-full uppercase tracking-wider">
                    Fixed Amount
                  </span>
                </div>

                <Button
                  onClick={handleDeposit}
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-600 text-emerald-100 font-bold border border-emerald-700 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-900/50 transition-all duration-300 rounded-lg relative overflow-hidden hover:scale-[1.02] uppercase tracking-widest text-sm"
                >
                  {loading ? (
                    <ArrowRightLeft className="w-4 h-4 animate-spin" />
                  ) : (
                    "Deposit 1 ETH"
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative space-y-3">
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-zinc-900/20 rounded-lg transition-opacity opacity-0 group-hover:opacity-100 duration-300"></div>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-800/30 to-zinc-800/30 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                    <div className="relative">
                      <div className="flex items-center space-x-2 mb-1">
                        <Wallet className="w-3.5 h-3.5 text-emerald-500/70" />
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                          Recipient
                        </span>
                      </div>
                      <Input
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="0x..."
                        className="bg-black/50 text-white placeholder-zinc-600 border-zinc-800/50 focus:border-emerald-700 hover:border-emerald-800/70 transition-colors duration-300 h-11 text-sm tracking-wide"
                      />
                    </div>
                  </div>

                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-zinc-900/20 rounded-lg transition-opacity opacity-0 group-hover:opacity-100 duration-300"></div>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-800/30 to-zinc-800/30 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                    <div className="relative">
                      <div className="flex items-center space-x-2 mb-1">
                        <KeyRound className="w-3.5 h-3.5 text-emerald-500/70" />
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                          Nullifier Hash
                        </span>
                      </div>
                      <Input
                        value={nullifierHash}
                        onChange={(e) => setNullifierHash(e.target.value)}
                        placeholder="Enter hash..."
                        className="bg-black/50 text-white placeholder-zinc-600 border-zinc-800/50 focus:border-emerald-700 hover:border-emerald-800/70 transition-colors duration-300 h-11 text-sm tracking-wide"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleWithdraw}
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-600 text-emerald-100 font-bold border border-emerald-700 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-900/50 transition-all duration-300 rounded-lg relative overflow-hidden hover:scale-[1.02] uppercase tracking-widest text-sm group"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer"></div>
                  {loading ? (
                    <ArrowRightLeft className="w-4 h-4 animate-spin" />
                  ) : (
                    "Withdraw Funds"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TornadoCashDemo;
