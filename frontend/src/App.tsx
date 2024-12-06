import TornadoCashDemo from "./components/TornadoCashDemo";
import WalletConnect from "./components/WalletConnect";
const App = () => {
  const handleDisconnect = () => {
    console.log("Wallet disconnected");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black relative">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-emerald-400 font-bold tracking-wide text-xl"></div>
          <WalletConnect onDisconnect={handleDisconnect} />
        </div>
      </header>
      <main className="pt-20">
        <TornadoCashDemo />
      </main>
    </div>
  );
};

export default App;
