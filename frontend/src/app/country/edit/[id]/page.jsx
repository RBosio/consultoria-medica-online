import FormCountry from "@/components/country/Form";
import axios from "axios";
import Link from "next/link";

async function getOne(id) {
  const data = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/country/${id}`
  );
  return data.data;
}

async function Edit({ params }) {
  const country = await getOne(params.id);
  return (
    <div>
      <Link href="../">
        <button className="p-2 bg-teal-500 text-center text-lg text-white rounded-lg">
          Regresar
        </button>
      </Link>
      <FormCountry id={params.id} name={country.name} method={"edit"} />;
    </div>
  );
}

export default Edit;
