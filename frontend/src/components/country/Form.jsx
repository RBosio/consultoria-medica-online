"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

function FormCountry({ id, name, method }) {
  const router = useRouter();

  const [country, setCountry] = useState({
    name,
  });

  const handleChange = (e) =>
    setCountry({
      name: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (method === "edit") {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/country/${id}`,
        country
      );
    } else if (method === "delete") {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/country/${id}`);
    } else {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/country`, country);

      router.push("./");
      return router.refresh();
    }

    router.push("../");
    router.refresh();
  };

  function operation() {
    if (method === "edit") {
      return "Editar";
    } else if (method === "delete") {
      return "Eliminar";
    } else {
      return "Agregar";
    }
  }

  return (
    <div className="bg-white w-96 m-auto p-4 rounded-md">
      <p className="text-3xl font-semibold text-center text-emerald-700">
        {operation()} pais
      </p>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center items-center my-4">
          <label htmlFor="name" className="text-xl mr-2">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="border border-gray-300 py-1 px-2 rounded-lg focus:border-indigo-500 outline-none focus:ring-1 focus:ring-indigo-500"
            onChange={handleChange}
            value={country.name || ""}
            autoComplete="off"
            disabled={method === "delete"}
            autoFocus
          />
        </div>
        <button className="p-2 bg-teal-500 text-white text-lg rounded-md block m-auto">
          Aceptar
        </button>
      </form>
    </div>
  );
}

export default FormCountry;
