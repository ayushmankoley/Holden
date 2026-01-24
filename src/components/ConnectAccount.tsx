import { WalletButton } from "./WalletButton";
import NetworkPill from "./NetworkPill";

const ConnectAccount = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <NetworkPill />
      <WalletButton />
    </div>
  );
};

export default ConnectAccount;
