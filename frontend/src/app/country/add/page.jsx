import FormCountry from "@/components/country/Form";
import Link from "next/link";

function Country() {
  return (
    <div>
      <Link href="../">
        <button className="p-2 bg-teal-500 text-center text-lg text-white rounded-lg">
          Regresar
        </button>
      </Link>
      <FormCountry />;
    </div>
  );
}

export default Country;
