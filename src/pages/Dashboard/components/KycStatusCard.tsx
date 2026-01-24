import { Icon } from "@stellar/design-system";

interface KycStatusCardProps {
  isLoading: boolean;
  isApproved: boolean;
  address?: string;
}

const KycStatusCard: React.FC<KycStatusCardProps> = ({
  isLoading,
  isApproved,
  address,
}) => {
  const getBadge = () => {
    if (isLoading) {
      return (
        <span className="kyc-card__badge kyc-card__badge--pending">
          Loading...
        </span>
      );
    }
    if (isApproved) {
      return (
        <span className="kyc-card__badge kyc-card__badge--approved">
          Verified
        </span>
      );
    }
    return (
      <span className="kyc-card__badge kyc-card__badge--not-verified">
        Not Verified
      </span>
    );
  };

  return (
    <div className="kyc-card">
      <div className="kyc-card__header">
        <h3 className="kyc-card__title">
          <Icon.Shield01 /> KYC Status
        </h3>
        {getBadge()}
      </div>

      {isLoading ? (
        <p className="kyc-card__description">Checking verification status...</p>
      ) : isApproved ? (
        <p className="kyc-card__description">
          Your identity has been verified. You can buy and sell assets on the
          platform.
        </p>
      ) : (
        <p className="kyc-card__description">
          Complete KYC verification to access trading features. Contact support
          to start the verification process.
        </p>
      )}

      {address && (
        <div className="kyc-card__address">
          {address.slice(0, 8)}...{address.slice(-8)}
        </div>
      )}
    </div>
  );
};

export default KycStatusCard;
