import axios from "axios";
import Link from "next/link";

async function getAll() {
  const data = await axios(`${process.env.NEXT_PUBLIC_BASE_URL}/country`);
  return data.data;
}

async function Countries() {
  const countries = await getAll();
  return (
    <div>
      <div className="flex justify-between">
        <Link href="/">
          <button className="p-2 bg-teal-500 text-center text-lg text-white rounded-lg">
            Regresar
          </button>
        </Link>
        <Link href="country/add">
          <button className="p-2 bg-green-500 text-center text-lg text-white rounded-lg">
            Agregar
          </button>
        </Link>
      </div>
      <h2 className="text-3xl text-center font-semibold underline text-emerald-700">
        Paises
      </h2>
      <div className="w-1/3 relative overflow-x-auto shadow-md sm:rounded-lg m-auto">
        <table className="w-full text-sm text-center rtl:text-right text-white dark:text-white">
          <thead className="text-xs text-white uppercase bg-gray-50 dark:bg-emerald-500 dark:text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                #
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3">
                Operaciones
              </th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country) => {
              return (
                <tr
                  className="odd:bg-white odd:dark:bg-teal-600 even:bg-gray-50 even:dark:bg-teal-500 border-b dark:border-gray-700 text-white"
                  key={country.id}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {country.id}
                  </th>
                  <td className="px-6 py-4">{country.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-between">
                      <Link href={`country/edit/${country.id}`}>
                        <button className="bg-blue-600 p-3 rounded-xl hover:cursor-pointer hover:opacity-70 shadow-lg">
                          Editar
                        </button>
                      </Link>
                      <Link href={`country/delete/${country.id}`}>
                        <button
                          className="bg-red-600 p-3 rounded-xl hover:cursor-pointer hover:opacity-70 
                        shadow-lg"
                        >
                          Eliminar
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Countries;
