import React from "react";
import LoadingAnimationTwo from "./loadingtwo";

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="flex flex-col items-center justify-center">
        <LoadingAnimationTwo loading={true} />
        <p className="mt-4 text-lg font-medium text-white">Processing transaction...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay; 