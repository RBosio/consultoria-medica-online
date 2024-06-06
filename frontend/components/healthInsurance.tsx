import React from "react";
import { useTheme } from "@mui/material";
import { FaKitMedical } from "react-icons/fa6";
import { UserHealthInsuranceResponseDto } from "./dto/userHealthInsurance.dto";

interface HIProps {
  healthInsurances: UserHealthInsuranceResponseDto[];
  className?: string;
}

const HealthInsurance: React.FC<HIProps> = (props) => {
  const theme = useTheme();

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-center ${props.className}`}
    >
      <div className="flex items-center gap-2">
        <FaKitMedical className="text-primary" />
        <div className="flex flex-col items-center gap-1">
          {props.healthInsurances.length > 0
            ? props.healthInsurances.map((hi) => {
                return (
                  <p className="text-sm">
                    {hi.healthInsurance.name} ({hi.cod})
                  </p>
                );
              })
            : "-"}
        </div>
      </div>
    </div>
  );
};

export default HealthInsurance;
