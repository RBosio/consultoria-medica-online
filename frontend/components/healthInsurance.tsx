import React from "react";
import { Chip, useTheme } from "@mui/material";
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
      <div className="flex flex-col items-center">
        <Chip color="primary" className="text-white px-2 py-1 my-1" icon={<FaKitMedical />} label="Obras sociales" />
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
